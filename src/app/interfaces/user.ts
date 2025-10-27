import { CustomRcipeList } from './recipe';

export interface User {
  id?: [number | string | undefined];
  email?: string;
  password: string;
  recipeList: CustomRcipeList[];
}
