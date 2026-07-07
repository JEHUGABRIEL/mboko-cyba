const API_BASE = '/api/data';

/** Get admin key from localStorage (set after successful login) */
function getAdminKey(): string {
  return localStorage.getItem('ctba_admin_token') || '';
}

async function request(method: string, body?: any) {
  const adminKey = getAdminKey();
  const res = await fetch(API_BASE, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(adminKey ? { 'x-admin-key': adminKey } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    // Session expirée — nettoyer les tokens et notifier le dashboard
    localStorage.removeItem('ctba_admin_auth');
    localStorage.removeItem('ctba_admin_token');
    window.dispatchEvent(new Event('auth:expired'));
    throw new Error('Session expirée. Veuillez vous reconnecter.');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

/** Fetch all data from Neon */
export async function fetchAllData() {
  return request('GET');
}

/** Create a new entity record */
export async function createEntity(entity: string, data: any) {
  return request('POST', { action: 'create', entity, data });
}

/** Update an existing entity record */
export async function updateEntity(entity: string, id: string, data: any) {
  return request('POST', { action: 'update', entity, id, data });
}

/** Delete an entity record */
export async function deleteEntity(entity: string, id: string) {
  return request('POST', { action: 'delete', entity, id });
}

/** Save page content (JSONB) */
export async function updatePageContent(data: Record<string, any>) {
  return request('POST', { action: 'update-page-content', data });
}

/** Fetch contact messages */
export async function fetchContactMessages() {
  return request('POST', { action: 'get-contact-messages' });
}

/** Save settings (JSONB) */
export async function updateSettings(data: Record<string, any>) {
  return request('POST', { action: 'update-settings', data });
}
