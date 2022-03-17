import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  // recipeSelected = new EventEmitter<Recipe>();
  recipeSelected = new Subject<Recipe>();
  recipesChanged = new Subject<Recipe[]>();
  ingredientsChanged = new Subject<Ingredient[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'A Test Recipe 1',
  //     'Recipe description 1',
  //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6Ubtqjg-peKi8NuJnkPNGA3Dz6D6pqjGDHg&usqp=CAU',
  //     [new Ingredient('Meat', 1), new Ingredient('French fries', 20)]
  //   ),
  //   new Recipe(
  //     'A Test Recipe 2',
  //     'Recipe description 2',
  //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT07oLsIIvtuzn6M2L-3fC82N_--QlCKw33IA&usqp=CAU',
  //     [new Ingredient('Tomatoes', 2), new Ingredient('Potatoes', 10)]
  //   ),
  //   new Recipe(
  //     'A Test Recipe 3',
  //     'Recipe description 3',
  //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDw0zfbjExXcN9ajtY8DpFJZBBGak2nIjAvw&usqp=CAU',
  //     [new Ingredient('Rise', 1), new Ingredient('Meat', 2)]
  //   ),
  // ];

  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  onAddIngredientsToRecipe(ingredients: Ingredient[]) {
    this.slService.toShoppingList(ingredients);
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    // this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }
}
