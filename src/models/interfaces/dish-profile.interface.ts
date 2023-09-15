export interface DishProfile {
  name: string | null;
  text: string | null;
  cost: number | null;
  price: string;
  tags: Array<string> | null;
  id?: string;
}
