export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  location: string;
  minimumQuantity?: number;
}
