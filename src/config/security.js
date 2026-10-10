/**
 * Configurare Securitate Butcher's Cut
 * 
 * NOTĂ PENTRU DEZVOLTATOR / FRIZER:
 * 1. Parola prestabilită este setată în constanta DEFAULT_ADMIN_PASSWORD de mai jos.
 * 2. Calea secretă de acces în panou este definită în DEFAULT_SECRET_ADMIN_SLUG.
 *    Ruta publică /admin este blocată și ascunsă intenționat pentru clienții de rând
 *    pentru a evita breșe de securitate sau tentative de ghicire.
 */

export const DEFAULT_ADMIN_PASSWORD = 'butcher2026';
export const DEFAULT_SECRET_ADMIN_SLUG = 'butcher-secret-portal';

const PASSWORD_STORAGE_KEY = 'butchers_admin_custom_password';
const SLUG_STORAGE_KEY = 'butchers_admin_secret_slug';

export function getAdminPassword() {
  const custom = localStorage.getItem(PASSWORD_STORAGE_KEY);
  return custom ? custom : DEFAULT_ADMIN_PASSWORD;
}

export function setAdminPassword(newPassword) {
  if (!newPassword || !newPassword.trim()) return false;
  localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword.trim());
  return true;
}

export function resetAdminPasswordToDefault() {
  localStorage.removeItem(PASSWORD_STORAGE_KEY);
}

export function checkAdminPassword(enteredPassword) {
  if (!enteredPassword) return false;
  const current = getAdminPassword();
  return enteredPassword.trim() === current.trim();
}

/**
 * Returnează slug-ul secret pentru accesarea panoului de admin.
 * Poate fi personalizat din panoul de administrare.
 */
export function getSecretAdminSlug() {
  const custom = localStorage.getItem(SLUG_STORAGE_KEY);
  if (custom && custom.trim()) {
    return custom.trim().replace(/^\/+/, '').replace(/\/+$/, '');
  }
  return DEFAULT_SECRET_ADMIN_SLUG;
}

export function setSecretAdminSlug(newSlug) {
  if (!newSlug || !newSlug.trim()) return false;
  const cleaned = newSlug.trim().replace(/^\/+/, '').replace(/\/+$/, '');
  localStorage.setItem(SLUG_STORAGE_KEY, cleaned);
  return true;
}

export function resetSecretAdminSlugToDefault() {
  localStorage.removeItem(SLUG_STORAGE_KEY);
}

/**
 * Verifică dacă adresa URL curentă corespunde portalului secret de administrare.
 * Ruta publică generică '/admin' este respinsă pentru a ascunde panoul de clienți.
 */
export function isSecretAdminUrl(pathname = '', search = '', hash = '') {
  const cleanPath = pathname.replace(/\/+$/, '').replace(/^\/+/, '');
  const cleanHash = hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  const slug = getSecretAdminSlug();

  // Verificare potrivire exactă cu slug-ul secret
  if (cleanPath === slug) return true;
  if (cleanHash === slug) return true;

  // Verificare parametru query opțional (ex: ?portal=butcher-secret-portal sau ?secret=...)
  try {
    const params = new URLSearchParams(search);
    if (params.get('portal') === slug || params.get('secret') === slug) {
      return true;
    }
  } catch {
    // ignoră erori URLSearchParams pe browsere vechi
  }

  return false;
}
