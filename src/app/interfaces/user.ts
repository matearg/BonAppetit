import { CustomRecipeLists } from './recipe';

export interface User {
  id?: number;
  email: string;
  password: string;
  recipeLists: CustomRecipeLists[];
}
