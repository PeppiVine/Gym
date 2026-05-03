export const API_BASE = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';
export const CUSTOMERS_URL = `${API_BASE}/customers`;
export const TRAININGS_URL = `${API_BASE}/trainings`;

// EXTRA: Hakee JSON-vastauksen ja heittää virheen, jos pyyntö epäonnistuu.
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, init);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

// EXTRA: Lähettää JSON-dataa (POST/PUT) palvelimelle.
export async function sendJson(url: string, method: 'POST' | 'PUT', body: unknown) {
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
}

// EXTRA: Poistaa yhden resurssin annetusta URL-osoitteesta.
export async function deleteResource(url: string) {
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
}
