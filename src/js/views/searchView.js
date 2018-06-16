import { elements } from './elements';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
};

const limitRecipeTitle = (title, limit = 18) => {
  // if (title.length > limit) {
  //   const newTitle = [];
  //   title.split(' ').reduce((acc, next) => {
  //     if (acc + next.length <= limit) {
  //       newTitle.push(next);
  //     }
  //     return acc + next.length + 1;
  //   }, 0);
  //   return `${newTitle.join(' ')} ...`;
  // } else {
  //   return title;
  // }
  if (title.length > limit) {
    return title.substring(0, title.substring(0, limit).lastIndexOf(' ')).concat(' ...');
  } else {
    return title;
  }
};

const renderRecipe = (recipe) => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
        </div>
      </a>
    </li>`;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

export const renderResults = (recipes) => {
  recipes.forEach(renderRecipe);
};
