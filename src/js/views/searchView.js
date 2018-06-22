import { elements } from './elements';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

export const highlightSelected = (id) => {
  // First loop through all recipe search results and remove the 'active' class
  Array.from(elements.searchResList.querySelectorAll('.results__link')).forEach((el) =>
    el.classList.remove('results__link--active')
  );
  // Then add the 'active' class to the one most recently selected (may be selected from 'liked' list)
  // First check that the element is still even on the page (due to pagination)
  const el = elements.searchResList.querySelector(`.results__link[href*="${id}"]`);
  if (el) {
    el.classList.add('results__link--active');
  }
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
  // OR....
  // if (title.length > limit) {
  //   return title.substring(0, title.substring(0, limit).lastIndexOf(' ')).concat(' ...');
  // } else {
  //   return title;
  // }
  //* Currently don't want to limit the title, so simply returning it
  return title;
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

const createButton = (page, type) => {
  // 'type' will be either 'prev' or 'next'
  const goToPage = type === 'prev' ? page - 1 : page + 1;
  const direction = type === 'prev' ? 'left' : 'right';
  return `
    <button class="btn-inline results__btn--${type}" data-goto="${goToPage}">
      <span>Page ${goToPage}</span>
      <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${direction}"></use>
      </svg>
    </button>
  `;
};

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let buttons = '';
  if (pages === 1) {
    // No buttons, b/c numResults only fills one page
  } else if (page === 1) {
    // Only button for next page, b/c currently on first page
    buttons = createButton(page, 'next');
  } else if (page === pages) {
    // Only button for previous page, b/c currently on last page
    buttons = createButton(page, 'prev');
  } else {
    // Both prev and next page buttons
    buttons = createButton(page, 'prev') + createButton(page, 'next');
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', buttons);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // Render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);

  // Render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
