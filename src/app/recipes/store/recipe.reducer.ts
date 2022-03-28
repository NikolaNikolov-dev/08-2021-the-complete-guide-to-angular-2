import { createReducer, on } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

export const initialState: State = {
  recipes: [],
};

export const recipeReducer = createReducer(
  initialState,
  on(RecipesActions.setRecipes, (state, recipes) => ({ ...state, ...recipes })),
  on(RecipesActions.fetchRecipes, (state, recipes) => ({
    ...state,
    ...recipes,
  })),
  on(RecipesActions.addRecipe, (state, { recipe }) => ({
    ...state,
    recipes: [...state.recipes, recipe],
  })),
  on(RecipesActions.updateRecipe, (state, { id, newRecipe }) => ({
    // const updatedRecipe = {...state.recipes[id],...newRecipe};
    // const updatedRecipes = [...state.recipes];
    // updatedRecipes[id] = updatedRecipe;
    ...state,
    ...{ ...state.recipes[id], ...newRecipe },
  })),
  on(RecipesActions.deleteRecipe, (state, { id }) => ({
    ...state,
    recipes: state.recipes.filter((r, index) => index !== id),
  }))
);
