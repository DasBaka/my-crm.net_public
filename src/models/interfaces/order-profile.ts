import { CustomerProfile } from './customer-profile';
import { DishProfile } from './dish-profile.interface';

export interface OrderProfile {
  id: string;
  timestamp: number;
  user?: {
    id?: string | null;
    data: CustomerProfile;
  };
  cart: { order: CartItem[]; price: string };
}

export type CartItem = DishProfile & {
  count: number;
  price: string;
};
