export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function mapId<T extends Record<string, any>>(doc: T): T & { id: string } {
  // Normalize MongoDB _id to id for frontend usage
  const id = (doc._id || doc.id || '').toString();
  const { _id, ...rest } = doc;
  return { ...rest, id } as any;
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth
export async function adminLogin(email: string, password: string) {
  const data = await http<{ ok: boolean; token?: string; error?: string }>(
    '/auth/admin/login',
    { method: 'POST', body: JSON.stringify({ email, password }) }
  );
  if (!data.ok) throw new Error(data.error || 'Falha no login');
  if (data.token) localStorage.setItem('token', data.token);
  return data;
}

// Electricians
export async function getElectricians() {
  const data = await http<any[]>('/electricians');
  return data.map(mapId);
}
export async function createElectrician(payload: any) {
  const data = await http<any>('/electricians', { method: 'POST', body: JSON.stringify(payload) });
  return mapId(data);
}
export async function updateElectrician(id: string, payload: any) {
  const data = await http<any>(`/electricians/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return mapId(data);
}

// Clients
export async function getClients() {
  const data = await http<any[]>('/clients');
  return data.map(mapId);
}
export async function createClient(payload: any) {
  const data = await http<any>('/clients', { method: 'POST', body: JSON.stringify(payload) });
  return mapId(data);
}
export async function updateClient(id: string, payload: any) {
  const data = await http<any>(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return mapId(data);
}

// Products
export async function getProducts() {
  const data = await http<any[]>('/products');
  return data.map(mapId);
}
export async function createProduct(payload: any) {
  const data = await http<any>('/products', { method: 'POST', body: JSON.stringify(payload) });
  return mapId(data);
}
export async function updateProduct(id: string, payload: any) {
  const data = await http<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return mapId(data);
}
export async function deleteProduct(id: string) {
  await http<any>(`/products/${id}`, { method: 'DELETE' });
  return { ok: true };
}

// Services
export async function getServices() {
  const data = await http<any[]>('/services');
  return data.map(mapId);
}
export async function createService(payload: any) {
  const data = await http<any>('/services', { method: 'POST', body: JSON.stringify(payload) });
  return mapId(data);
}
export async function updateService(id: string, payload: any) {
  const data = await http<any>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return mapId(data);
}