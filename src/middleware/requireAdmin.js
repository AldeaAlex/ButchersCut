export function requireAdmin(req, res, next) {
  // Dacă nu există admin în sesiune, trimitem utilizatorul la login.
  if (!req.session.admin) {
    req.flash("error", "Trebuie să fii autentificat pentru a accesa dashboard-ul.");
    return res.redirect("/admin/login");
  }

  return next();
}