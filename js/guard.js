/**
 * Guard.js - Persistencia de sesión MatchFlow
 * Gestiona el estado de autenticación y protege rutas
 */

const SESSION_KEY = 'matchflow_session';
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 días

const Guard = {
  /**
   * Guarda la sesión del usuario en localStorage
   * @param {Object} user - Usuario autenticado
   */
  setSession(user) {
    const session = {
      user,
      expiresAt: Date.now() + SESSION_TIMEOUT,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  /**
   * Obtiene la sesión actual
   * @returns {Object|null} Sesión o null si no existe o expiró
   */
  getSession() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;

      const session = JSON.parse(data);
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  /**
   * Obtiene el usuario actualmente logueado
   */
  getCurrentUser() {
    const session = this.getSession();
    return session ? session.user : null;
  },

  /**
   * Verifica si hay sesión activa
   */
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  /**
   * Verifica si el usuario es candidato
   */
  isCandidate() {
    const user = this.getCurrentUser();
    return user?.type === 'candidate';
  },

  /**
   * Verifica si el usuario es empresa
   */
  isCompany() {
    const user = this.getCurrentUser();
    return user?.type === 'company';
  },

  /**
   * Cierra la sesión
   */
  clearSession() {
    localStorage.removeItem(SESSION_KEY);
  },

  /**
   * Protege una página - redirige a login si no hay sesión
   * @param {string} redirectUrl - URL a la que redirigir si no autenticado
   */
  requireAuth(redirectUrl = 'login.html') {
    if (!this.isAuthenticated()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },

  /**
   * Protege una página para solo candidatos
   */
  requireCandidate(redirectUrl = 'dashboard.html') {
    if (!this.requireAuth(redirectUrl)) return false;
    if (!this.isCandidate()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },

  /**
   * Protege una página para solo empresas
   */
  requireCompany(redirectUrl = 'dashboard.html') {
    if (!this.requireAuth(redirectUrl)) return false;
    if (!this.isCompany()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },
};
