import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/elements';
import * as utilities from './views/utilities';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const controlSearch = async () => {
  // 1. Get query from the view
  const query = searchView.getInput();

  if (query) {
    // 2. New search object and add to state
    state.search = new Search(query);
    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    utilities.renderLoader(elements.searchRes);
    // 4. Search for recipes. 'getResults()' is an async method, which means it returns a promise
    await state.search.getResults();
    // 5. Render results on UI
    utilities.clearLoader();
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});
