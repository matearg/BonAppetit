import { Routes } from '@angular/router';
import { Initial } from './views/initial/initial';
import { HomePage } from './views/home-page/home-page';
import { authUsersGuard } from './users/auth-users-guard';
import { Profile } from './views/profile/profile';
import { EditProfile } from './users/edit-profile/edit-profile';
import { ListDetails } from './recipes/list-details/list-details';
import { CustomRecipeList } from './recipes/custom-recipe-list/custom-recipe-list';
import { MyLists } from './recipes/my-lists/my-lists';
import { RecipeDetail } from './recipes/recipe-detail/recipe-detail';
import { RecipeForm } from './recipes/recipe-form/recipe-form';
import { RecipeList } from './recipes/recipe-list/recipe-list';

export const routes: Routes = [
  {
    path: '',
    component: Initial,
  },
  {
    path: 'home',
    component: HomePage,
    canActivate: [authUsersGuard],
  },
  {
    path: 'recipes-details/:id',
    component: RecipeDetail,
    canActivate: [authUsersGuard],
  },
  {
    path: 'add-recipe',
    component: RecipeForm,
    canActivate: [authUsersGuard],
  },
  {
    path: 'update-recipe/:idList/:idRecipe',
    component: RecipeForm,
    canActivate: [authUsersGuard],
  },
  {
    path: 'recipes',
    component: RecipeList,
    canActivate: [authUsersGuard],
  },
  {
    path: 'add-list',
    component: CustomRecipeList,
    canActivate: [authUsersGuard],
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authUsersGuard],
  },
  {
    path: 'edit-profile/:id',
    component: EditProfile,
    canActivate: [authUsersGuard],
  },
  {
    path: 'my-lists',
    component: MyLists,
    canActivate: [authUsersGuard],
  },
  {
    path: 'list/:id',
    component: ListDetails,
    canActivate: [authUsersGuard],
  },
  {
    path: 'recipe-list-details/:idList/:idRecipe',
    component: RecipeDetail,
    canActivate: [authUsersGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
