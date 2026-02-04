/**
 * API MatchFlow - Configuración para json-server
 */
const API_URL = 'http://localhost:3001';

const api = {
  async get(resource) {
    const res = await fetch(`${API_URL}/${resource}`);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
  async post(resource, data) {
    const res = await fetch(`${API_URL}/${resource}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
  async put(resource, id, data) {
    const res = await fetch(`${API_URL}/${resource}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
  async patch(resource, id, data) {
    const res = await fetch(`${API_URL}/${resource}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
  async delete(resource, id) {
    const res = await fetch(`${API_URL}/${resource}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
};
