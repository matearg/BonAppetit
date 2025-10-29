export interface RandomRecipe {
  recipes: Recipe[];
}

export interface Recipe {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  preparationMinutes: null;
  cookingMinutes: null;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  license: string;
  sourceName: string;
  pricePerServing: number;
  extendedIngredients: ExtendedIngredient[];
  id: number | string | undefined;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  image: string;
  imageType: string;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: any[];
  instructions: string;
  analyzedInstructions: AnalyzedInstruction[];
  originalId: null;
  spoonacularScore: number;
  spoonacularSourceUrl: string;
}

export interface AnalyzedInstruction {
  name: string;
  steps: Step[];
}

export interface Step {
  number: number;
  step: string;
  ingredients: Ent[];
  equipment: Ent[];
}

export interface Ent {
  id: number | string | undefined;
  name: string;
  localizedName: string;
  image: string;
}

export interface ExtendedIngredient {
  id: number | string | undefined;
  aisle: string;
  image: string;
  consistency: Consistency;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
  measures: Measures;
}

export enum Consistency {
  Liquid = 'LIQUID',
  Solid = 'SOLID',
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
