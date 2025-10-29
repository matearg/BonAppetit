export interface Recipe {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  id?: number | string | undefined;
  title: string;
  readyInMinutes: number;
  servings: number;
  image: string;
  instructions: string;
  spoonacularScore: number;
  anotaciones?: string;
  ingredientes: Ingredients[];
}

export interface Ingredients {
  id?: number | string | undefined;
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeInfo {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  aggregateLikes: number;
  healthScore: number;
  extendedIngredients: ExtendedIngredient[];
  id: number | string | undefined;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  image: string;
  summary: string;
  cuisines: any[];
  dishTypes: string[];
  diets: any[];
  occasions: any[];
  instructions: string;
  analyzedInstructions: any[];
  spoonacularScore: number;
  spoonacularSourceUrl: string;
}

export interface ExtendedIngredient {
  id: number | string | undefined;
  aisle: string;
  image: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  measures: Measures;
}

export interface Measures {
  us: Metric;
  metric: Metric;
}

export interface Metric {
  amount: number;
  unitShort: string;
  unitLong: string;
}

export interface CustomRecipeList {
  id: number | string | undefined;
  name?: string;
  recipes: Recipe[];
}

export interface RecipeAlt {
  id?: number | string | undefined;
  title: string;
  ingredients: (string | null)[];
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  readyInMinutes: number;
  servings: number;
  instructions: string;
}
