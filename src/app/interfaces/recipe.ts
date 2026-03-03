export interface Recipe {
  id: string;
  title: string;
  image: string;
  anotations?: string | null;

  // Nuevos campos opcionales para recetas manuales
  isCustom?: boolean;
  ingredients?: string[];
  instructions?: string;
}

export interface CustomRecipeLists {
  id: number;
  name?: string;
  recipes: Recipe[];
}
