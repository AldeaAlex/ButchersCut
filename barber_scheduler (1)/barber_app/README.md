# ✂️ Barber Scheduler — Ghid de instalare

## Cerințe
- Python 3.8+
- pip

---

## Instalare rapidă

```bash
# 1. Creează un folder și mută fișierele acolo
cd barber_app

# 2. Instalează dependențele
pip install -r requirements.txt

# 3. Pornește aplicația
python app.py
```

Aplicația va porni pe **http://localhost:5000**

---

## Configurare inițială

Deschide `app.py` și modifică aceste valori în primele linii:

```python
BARBER_PHONE = "40712345678"   # Numărul tău de WhatsApp (fără +, cu prefix de țară)
BARBER_NAME = "George"          # Numele tău
SHOP_NAME = "Frizerie George"   # Numele frizerie
ADMIN_PASSWORD = "admin123"     # Parola pentru panoul admin (schimb-o!)
```

### Servicii
Modifică lista `SERVICES` pentru a adăuga serviciile tale:
```python
SERVICES = [
    {"id": 1, "name": "Tuns simplu", "duration": 30, "price": 40},
    # adaugă mai multe...
]
```

### Program de lucru
```python
WORKING_HOURS = {
    "start": "09:00",       # Ora de deschidere
    "end": "18:00",         # Ora de închidere
    "lunch_start": "13:00", # Pauza de prânz start
    "lunch_end": "14:00",   # Pauza de prânz final
    "slot_minutes": 30,     # Durata minimă a unui slot
    "days_off": [6],        # 0=Luni, 6=Duminică
}
```

---

## Utilizare

### Panoul Admin — http://localhost:5000/admin
- **Vizualizare programări** pe zile (← / →)
- **Adaugă programări** manual pentru clienți
- **Confirmă / Anulează** programări cu un click
- **Trimite reminder pe WhatsApp** clienților (click pe 💬)
- **Statistici** zilnice: număr clienți, venit estimat

### Pagina Clienți — http://localhost:5000
- Clienții pot alege serviciul, data, ora
- Completează numele și telefonul
- La final, primesc un link WhatsApp pre-completat
  pentru a confirma programarea cu tine

---

## Deploy online (opțional)

### Varianta gratuită cu Railway
1. Creează cont pe [railway.app](https://railway.app)
2. Conectează GitHub
3. Deploy din repo — funcționează automat cu Flask

### Varianta cu ngrok (test rapid, temporar)
```bash
pip install pyngrok
ngrok http 5000
```
Primești un link public temporar pe care îl dai clienților.

---

## Structura fișierelor

```
barber_app/
├── app.py              # Logica principală Flask
├── requirements.txt    # Dependențe Python
├── barber.db           # Baza de date SQLite (creat automat)
├── templates/
│   ├── booking.html    # Pagina publică pentru clienți
│   ├── admin.html      # Panoul admin
│   └── login.html      # Login admin
└── README.md
```
