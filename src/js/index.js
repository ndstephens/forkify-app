// const recipeUrl = `http://food2fork.com/api/get?key=${APIkey}`;

import Search from './models/Search';

const search = new Search('pizza');
search.getResults();
