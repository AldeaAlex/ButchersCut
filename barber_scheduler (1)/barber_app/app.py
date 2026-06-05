from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import sqlite3, json, os, math
from datetime import datetime, date, timedelta

app = Flask(__name__)
app.secret_key = "barberscut_secret_schimba_asta_2025"

DB_PATH      = "barber.db"
BARBER_NAME  = "Alex Măci"
SHOP_NAME    = "Barber's Cut"
OWNER_NAME   = "Alexandru Măcelaru"
LOCATION     = "Barcani, județul Covasna"
ADMIN_PASSWORD       = "admin123"
DATA_RETENTION_MONTHS = 6
SLOT_MINUTES = 30

SERVICES = [
    {"id": 1, "name": "Tuns simplu",   "duration": 30, "price": 40},
    {"id": 2, "name": "Tuns + Barbă",  "duration": 45, "price": 60},
    {"id": 3, "name": "Barbă",         "duration": 20, "price": 30},
    {"id": 4, "name": "Tuns copii",    "duration": 25, "price": 35},
    {"id": 5, "name": "Tuns + Spălat", "duration": 40, "price": 50},
]

# Zilele săptămânii în română (0=Luni … 6=Duminică)
DAY_NAMES = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"]

# Program implicit (toate zilele 09:00-18:00, duminica închis)
DEFAULT_SCHEDULE = {
    "0": {"open": True,  "start": "09:00", "end": "18:00"},
    "1": {"open": True,  "start": "09:00", "end": "18:00"},
    "2": {"open": True,  "start": "09:00", "end": "18:00"},
    "3": {"open": True,  "start": "09:00", "end": "18:00"},
    "4": {"open": True,  "start": "09:00", "end": "18:00"},
    "5": {"open": True,  "start": "09:00", "end": "18:00"},
    "6": {"open": False, "start": "09:00", "end": "18:00"},
}

# ─── DB ────────────────────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            client_name  TEXT    NOT NULL,
            client_phone TEXT    NOT NULL,
            service_id   INTEGER NOT NULL,
            date         TEXT    NOT NULL,
            time         TEXT    NOT NULL,
            status       TEXT    DEFAULT 'confirmed',
            notes        TEXT    DEFAULT '',
            source       TEXT    DEFAULT 'manual',
            gdpr_consent INTEGER DEFAULT 0,
            created_at   TEXT    DEFAULT (datetime('now'))
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    """)
    # Inserăm programul implicit dacă nu există
    existing = conn.execute("SELECT value FROM settings WHERE key='schedule'").fetchone()
    if not existing:
        conn.execute("INSERT INTO settings (key, value) VALUES ('schedule', ?)",
                     (json.dumps(DEFAULT_SCHEDULE),))
    conn.commit()
    conn.close()

def purge_old_data():
    cutoff = (date.today() - timedelta(days=DATA_RETENTION_MONTHS * 30)).isoformat()
    conn = get_db()
    conn.execute("DELETE FROM appointments WHERE date < ?", (cutoff,))
    conn.commit()
    conn.close()

# ─── SCHEDULE HELPERS ──────────────────────────────────────────────
def get_schedule():
    conn = get_db()
    row  = conn.execute("SELECT value FROM settings WHERE key='schedule'").fetchone()
    conn.close()
    return json.loads(row["value"]) if row else DEFAULT_SCHEDULE

def save_schedule(schedule):
    conn = get_db()
    conn.execute("INSERT OR REPLACE INTO settings (key, value) VALUES ('schedule', ?)",
                 (json.dumps(schedule),))
    conn.commit()
    conn.close()

def day_config(date_str):
    """Returnează configurația zilei (open, start, end) pentru o dată dată."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d")
    except Exception:
        return None
    weekday = str(d.weekday())   # "0"=Luni … "6"=Duminică
    sched   = get_schedule()
    return sched.get(weekday, DEFAULT_SCHEDULE[weekday])

# ─── SLOT HELPERS ──────────────────────────────────────────────────
def get_service(service_id):
    for s in SERVICES:
        if s["id"] == int(service_id):
            return s
    return None

def get_booked_slots(date_str):
    conn = get_db()
    rows = conn.execute(
        "SELECT time, service_id FROM appointments WHERE date=? AND status != 'cancelled'",
        (date_str,)
    ).fetchall()
    conn.close()
    booked = []
    for row in rows:
        svc = get_service(row["service_id"])
        if svc:
            start = datetime.strptime(row["time"], "%H:%M")
            slots_needed = math.ceil(svc["duration"] / SLOT_MINUTES)
            for i in range(slots_needed):
                booked.append(
                    (start + timedelta(minutes=i * SLOT_MINUTES)).strftime("%H:%M")
                )
    return booked

def get_available_slots(date_str, service_id):
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d")
    except Exception:
        return []
    if d.date() < date.today():
        return []

    cfg = day_config(date_str)
    if not cfg or not cfg.get("open"):
        return []

    svc = get_service(service_id)
    if not svc:
        return []

    start   = datetime.strptime(f"{date_str} {cfg['start']}", "%Y-%m-%d %H:%M")
    end     = datetime.strptime(f"{date_str} {cfg['end']}",   "%Y-%m-%d %H:%M")
    booked  = get_booked_slots(date_str)
    slots_needed = math.ceil(svc["duration"] / SLOT_MINUTES)
    available = []
    current   = start

    while current + timedelta(minutes=svc["duration"]) <= end:
        all_free = True
        for i in range(slots_needed):
            check = (current + timedelta(minutes=i * SLOT_MINUTES)).strftime("%H:%M")
            if check in booked:
                all_free = False
                break
        if all_free:
            available.append(current.strftime("%H:%M"))
        current += timedelta(minutes=SLOT_MINUTES)

    return available

# ─── PUBLIC ROUTES ─────────────────────────────────────────────────
@app.route("/")
def index():
    purge_old_data()
    return render_template("booking.html",
                           services=SERVICES,
                           shop_name=SHOP_NAME,
                           barber_name=BARBER_NAME)

@app.route("/api/slots")
def api_slots():
    date_str   = request.args.get("date", "")
    service_id = request.args.get("service_id", 1)
    cfg        = day_config(date_str)
    if not cfg or not cfg.get("open"):
        return jsonify({"slots": [], "closed": True})
    return jsonify({"slots": get_available_slots(date_str, service_id), "closed": False})

@app.route("/api/book", methods=["POST"])
def api_book():
    data       = request.json
    name       = data.get("name", "").strip()
    phone      = data.get("phone", "").strip()
    service_id = data.get("service_id")
    date_str   = data.get("date", "")
    time_str   = data.get("time", "")
    consent    = data.get("gdpr_consent", False)

    if not all([name, phone, service_id, date_str, time_str]):
        return jsonify({"ok": False, "error": "Toate câmpurile sunt obligatorii."})
    if not consent:
        return jsonify({"ok": False, "error": "Trebuie să accepți politica de confidențialitate."})

    cfg = day_config(date_str)
    if not cfg or not cfg.get("open"):
        return jsonify({"ok": False, "error": "Salonul este închis în ziua selectată."})

    svc = get_service(service_id)
    if not svc:
        return jsonify({"ok": False, "error": "Serviciu invalid."})

    available = get_available_slots(date_str, service_id)
    if time_str not in available:
        return jsonify({"ok": False, "error": "Intervalul nu mai este disponibil. Alege altul."})

    conn = get_db()
    conn.execute(
        """INSERT INTO appointments
           (client_name, client_phone, service_id, date, time, status, source, gdpr_consent)
           VALUES (?,?,?,?,?,?,?,?)""",
        (name, phone, service_id, date_str, time_str, "confirmed", "online", 1)
    )
    conn.commit()
    conn.close()
    return jsonify({"ok": True, "service": svc["name"], "date": date_str, "time": time_str})

@app.route("/confidentialitate")
def privacy():
    return render_template("privacy.html",
                           shop_name=SHOP_NAME, owner_name=OWNER_NAME,
                           location=LOCATION, retention_months=DATA_RETENTION_MONTHS)

# ─── ADMIN ROUTES ──────────────────────────────────────────────────
@app.route("/admin")
def admin():
    if not session.get("admin"):
        return redirect(url_for("login"))
    today     = date.today().isoformat()
    view_date = request.args.get("date", today)

    conn         = get_db()
    appointments = conn.execute(
        "SELECT * FROM appointments WHERE date=? ORDER BY time", (view_date,)
    ).fetchall()

    total_today = conn.execute(
        "SELECT COUNT(*) as c FROM appointments WHERE date=? AND status != 'cancelled'", (today,)
    ).fetchone()["c"]

    revenue_today = 0
    for a in conn.execute(
        "SELECT service_id FROM appointments WHERE date=? AND status='confirmed'", (today,)
    ):
        svc = get_service(a["service_id"])
        if svc:
            revenue_today += svc["price"]

    pending = conn.execute(
        "SELECT COUNT(*) as c FROM appointments WHERE status='pending'"
    ).fetchone()["c"]
    conn.close()

    appts_with_service = []
    for a in appointments:
        d = dict(a)
        d["service"] = get_service(a["service_id"])
        appts_with_service.append(d)

    vd       = datetime.strptime(view_date, "%Y-%m-%d")
    prev_day = (vd - timedelta(days=1)).strftime("%Y-%m-%d")
    next_day = (vd + timedelta(days=1)).strftime("%Y-%m-%d")
    schedule = get_schedule()

    return render_template("admin.html",
                           appointments=appts_with_service,
                           services=SERVICES,
                           view_date=view_date,
                           today=today,
                           prev_day=prev_day,
                           next_day=next_day,
                           total_today=total_today,
                           revenue_today=revenue_today,
                           pending=pending,
                           shop_name=SHOP_NAME,
                           schedule=schedule,
                           day_names=DAY_NAMES)

@app.route("/admin/login", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        if request.form.get("password") == ADMIN_PASSWORD:
            session["admin"] = True
            return redirect(url_for("admin"))
        error = "Parolă incorectă."
    return render_template("login.html", error=error, shop_name=SHOP_NAME)

@app.route("/admin/logout")
def logout():
    session.pop("admin", None)
    return redirect(url_for("login"))

@app.route("/admin/add", methods=["POST"])
def admin_add():
    if not session.get("admin"):
        return jsonify({"ok": False})
    data = request.json
    conn = get_db()
    conn.execute(
        """INSERT INTO appointments
           (client_name, client_phone, service_id, date, time, status, notes, source, gdpr_consent)
           VALUES (?,?,?,?,?,?,?,?,?)""",
        (data["name"], data["phone"], data["service_id"],
         data["date"], data["time"], "confirmed",
         data.get("notes", ""), "manual", 1)
    )
    conn.commit()
    conn.close()
    return jsonify({"ok": True})

@app.route("/admin/update", methods=["POST"])
def admin_update():
    if not session.get("admin"):
        return jsonify({"ok": False})
    data = request.json
    conn = get_db()
    conn.execute("UPDATE appointments SET status=? WHERE id=?", (data["status"], data["id"]))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})

@app.route("/admin/delete", methods=["POST"])
def admin_delete():
    if not session.get("admin"):
        return jsonify({"ok": False})
    data = request.json
    conn = get_db()
    conn.execute("DELETE FROM appointments WHERE id=?", (data["id"],))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})

@app.route("/admin/slots")
def admin_slots():
    if not session.get("admin"):
        return jsonify({"slots": []})
    date_str   = request.args.get("date", "")
    service_id = request.args.get("service_id", 1)
    return jsonify({"slots": get_available_slots(date_str, service_id)})

@app.route("/admin/schedule", methods=["GET"])
def admin_schedule_get():
    if not session.get("admin"):
        return jsonify({"ok": False})
    return jsonify(get_schedule())

@app.route("/admin/schedule", methods=["POST"])
def admin_schedule_save():
    if not session.get("admin"):
        return jsonify({"ok": False})
    data = request.json
    # Validare minimă
    for day_key, cfg in data.items():
        if not isinstance(cfg.get("open"), bool):
            return jsonify({"ok": False, "error": "Date invalide."})
        try:
            datetime.strptime(cfg["start"], "%H:%M")
            datetime.strptime(cfg["end"],   "%H:%M")
        except Exception:
            return jsonify({"ok": False, "error": f"Ore invalide pentru ziua {day_key}."})
    save_schedule(data)
    return jsonify({"ok": True})

if __name__ == "__main__":
    init_db()
    print(f"\n✂️  {SHOP_NAME} — Barber Scheduler")
    print(f"   Booking:  http://localhost:5000")
    print(f"   Admin:    http://localhost:5000/admin")
    print(f"   Parola:   {ADMIN_PASSWORD}\n")
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)
