const API_BASE_URL = 'http://localhost:3000/api';

export interface Item {
  id: string;
  name: string;
  category: string;
  location: string;
  quantity: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Stats {
  totalItems: number;
  activeLocations: number;
  lowStockItems: number;
  pendingTransfers: number;
}

export const fetchItems = async (
  search?: string,
  category?: string,
  location?: string,
  sort?: string,
  direction?: 'asc' | 'desc'
): Promise<Item[]> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (location) params.append('location', location);
  if (sort) params.append('sort', sort);
  if (direction) params.append('direction', direction);

  const response = await fetch(`${API_BASE_URL}/items?${params}`);
  if (!response.ok) throw new Error('Failed to fetch items');
  return response.json();
};

export const fetchStats = async (): Promise<Stats> => {
  const response = await fetch(`${API_BASE_URL}/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};

export const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const fetchLocations = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/locations`);
  if (!response.ok) throw new Error('Failed to fetch locations');
  return response.json();
};

export const createItem = async (item: Omit<Item, 'id' | 'status'>): Promise<{ id: string }> => {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error('Failed to create item');
  return response.json();
};

export const updateItem = async (id: string, item: Omit<Item, 'id' | 'status'>): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error('Failed to update item');
};

export const deleteItem = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete item');
};