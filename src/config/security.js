/**
 * Configurare Securitate Butcher's Cut
 * 
 * NOTĂ PENTRU DEZVOLTATOR / FRIZER:
 * Parola prestabilită este setată în constanta DEFAULT_ADMIN_PASSWORD de mai jos.
 * Poți schimba această parolă direct aici în cod, sau frizerul o poate modifica
 * oricând din panoul de administrare (va fi salvată în browser).
 */

export const DEFAULT_ADMIN_PASSWORD = 'butcher2026';

const STORAGE_KEY = 'butchers_admin_custom_password';

export function getAdminPassword() {
  const custom = localStorage.getItem(STORAGE_KEY);
  return custom ? custom : DEFAULT_ADMIN_PASSWORD;
}

export function setAdminPassword(newPassword) {
  if (!newPassword || !newPassword.trim()) return false;
  localStorage.setItem(STORAGE_KEY, newPassword.trim());
  return true;
}

export function resetAdminPasswordToDefault() {
  localStorage.removeItem(STORAGE_KEY);
}

export function checkAdminPassword(enteredPassword) {
  if (!enteredPassword) return false;
  const current = getAdminPassword();
  return enteredPassword.trim() === current.trim();
}
