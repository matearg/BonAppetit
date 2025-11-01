import { CustomRecipeLists } from './recipe';

export interface User {
  id?: number | string | undefined;
  email?: string;
  password: string;
  recipeLists: CustomRecipeLists[];
}
