import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements } from './views/elements';
import * as utilities from './views/utilities';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};
// TODO: FOR TESTING PURPOSES
window.state = state;

//
//? ---------------------------------------------------------------------------
//? SEARCH CONTROLLER
//? ---------------------------------------------------------------------------
const ctrlSearch = async () => {
  // Get query from the view
  const query = searchView.getInput();

  if (query) {
    // Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    utilities.renderLoader(elements.searchRes);

    // Create new search object and add to state
    state.search = new Search(query);

    try {
      // Search for recipes. 'getResults()' is an async method, which means it returns a promise
      await state.search.getResults();

      // Render results on UI
      utilities.clearLoader(elements.searchRes);
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert('Error retrieving recipes');
      console.log(error);
      utilities.clearLoader(elements.searchRes);
    }
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  ctrlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

//
//? ---------------------------------------------------------------------------
//? RECIPE CONTROLLER
//? ---------------------------------------------------------------------------
const ctrlRecipe = async () => {
  // Get id from url hash
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    utilities.renderLoader(elements.recipe);

    // Highlight selected search item in list
    if (state.search) {
      searchView.highlightSelected(id);
    }

    // Create new recipe object and add to state
    state.recipe = new Recipe(id);

    try {
      // Get recipe data
      await state.recipe.getRecipe();

      // Parse ingredients
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      utilities.clearLoader(elements.recipe);
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert('Error retrieving recipe');
      console.log(error);
    }
  }
};

// When the window loads or a recipe is clicked on, check the url hash for the recipe id and display it
window.addEventListener('load', ctrlRecipe);
window.addEventListener('hashchange', ctrlRecipe);
// ['hashchange', 'load'].forEach((event) => {
//   window.addEventListener(event, ctrlRecipe);
// });

//
//? ---------------------------------------------------------------------------
//? SHOPPING LIST CONTROLLER
//? ---------------------------------------------------------------------------
const ctrlList = () => {
  // Create a new list If there is none yet
  if (!state.list) {
    state.list = new List();
  }

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.quantity, el.unit, el.description);
    listView.renderItem(item);
  });
};

// Handle updating and deleting shopping list items
elements.shoppingList.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state and UI
    state.list.deleteItem(id);
    listView.deleteItemUI(id);

    // Handle updating quantity
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value);
    if (val >= 0) {
      state.list.updateQuantity(id, val);
    }
  }
});

// Increase or decrease 'servings' and ingredient quantities
// Also, add ingredients to the Shopping List
elements.recipe.addEventListener('click', (e) => {
  //* match the button or its children elements
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
    ctrlList();
  }
});
