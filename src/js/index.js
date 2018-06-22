import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as likesView from './views/likesView';
import * as listView from './views/listView';
import * as recipeView from './views/recipeView';
import * as searchView from './views/searchView';
import { elements } from './views/elements';
import * as utilities from './views/utilities';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes list
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

// Submit search query
elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  ctrlSearch();
});

// Click on pagination button
elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
    // If currently displayed recipe is in listed search results then highlight it
    const currentRecipeID = window.location.hash.replace('#', '');
    searchView.highlightSelected(currentRecipeID);
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
      recipeView.renderRecipe(
        // prettier ignore
        state.recipe,
        state.likes ? state.likes.isLiked(id) : undefined
      );
    } catch (error) {
      alert('Error retrieving recipe');
      console.log(error);
    }
  }
};

// When a recipe is clicked on from the search list, display it based on changed url hash id
window.addEventListener('hashchange', ctrlRecipe);

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

//
//? ---------------------------------------------------------------------------
//? LIKES CONTROLLER
//? ---------------------------------------------------------------------------
const ctrlLike = () => {
  if (!state.likes) {
    state.likes = new Likes();
  }
  const currentID = state.recipe.id;

  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add liked recipe to the state
    const newLike = state.likes.addLike(
      // prettier ignore
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    likesView.toggleLikeBtn(true);
    // Add liked recipe to the UI list
    likesView.renderLike(newLike);

    // User HAS already liked current recipe
  } else {
    // Remove liked recipe from the state
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove liked recipe from the UI list
    likesView.deleteLikeUI(currentID);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//
//* When the window loads:
// Retrieve and display saved likes from localStorage if available and
// Check the url hash for a recipe id and display it
window.addEventListener('load', () => {
  state.likes = new Likes();
  // Restore like from localStorage if available
  state.likes.readStorage();
  // Render existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
  // Display likes heart icon if there are saved likes
  likesView.toggleLikeMenu(state.likes ? state.likes.getNumLikes() : undefined);

  // Load recipe from ID in url hash if present
  ctrlRecipe();
});

//
//* EVENT DELEGATION ON THE RECIPE VIEW
// Increase or decrease 'servings' and ingredient quantities
// Add ingredients to the Shopping List
// Add recipe to the Likes list
elements.recipe.addEventListener('click', (e) => {
  //* match the button or its children elements
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease servings
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase servings
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);

    // Add ingredients to shopping list
  } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
    ctrlList();

    // Add recipe to Likes list
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    ctrlLike();
  }
});
