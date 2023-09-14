import { DishProfile } from '../interfaces/dish-profile.interface';

export class Dish implements DishProfile {
  name: string | null;
  text: string | null;
  cost: number | null;
  price: string = '';
  tags: Array<string> | null;

  constructor(data?: DishProfile) {
    this.name = data?.name ?? null;
    this.text = data?.text ?? null;
    this.cost = data?.cost ?? null;
    this.tags = data?.tags ?? null;
  }
}
