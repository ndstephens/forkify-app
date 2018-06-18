import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements } from './views/elements';
import * as utilities from './views/utilities';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

//? SEARCH CONTROLLER
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

//? RECIPE CONTROLLER
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

window.addEventListener('hashchange', ctrlRecipe);
window.addEventListener('load', ctrlRecipe);
// ['hashchange', 'load'].forEach((event) => {
//   window.addEventListener(event, ctrlRecipe);
// });
