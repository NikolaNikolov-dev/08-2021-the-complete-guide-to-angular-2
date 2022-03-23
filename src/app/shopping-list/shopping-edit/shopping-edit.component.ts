import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import {
  Subject,
  Subscription,
  Observable,
  takeUntil,
  withLatestFrom,
} from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  // editedItemIndex: number;
  editedItem: Ingredient;

  ingredients: Observable<Ingredient[]>;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private slService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    // this.subscription = this.slService.startedEditing.subscribe(
    //   (index: number) => {
    //     this.editedItemIndex = index;
    //     this.editMode = true;
    //     this.editedItem = this.slService.getIngredient(index);
    //     this.slForm.setValue({
    //       name: this.editedItem.name,
    //       amount: this.editedItem.amount,
    //     });
    //   }
    // );

    this.ingredients = this.store.select('shoppingList').pipe(
      takeUntil(this.destroy$),
      select((state) => state.ingredients)
    );

    this.store
      .select('shoppingList')
      .pipe(
        takeUntil(this.destroy$),
        select((state) => state.editedIngredientIndex),
        withLatestFrom(
          this.store.select('shoppingList').pipe(
            takeUntil(this.destroy$),
            select((state) => state.editedIngredient)
          )
        )
      )
      .subscribe(([editedIngredientIndex, editedIngredient]) => {
        if (editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = editedIngredient;
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          });
        } else {
          this.editMode = false;
        }
      });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.slService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      );
    } else {
      // this.slService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // this.slService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(
      new ShoppingListActions.DeleteIngredient(/*this.editedItemIndex*/)
    );
    this.onClear();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
