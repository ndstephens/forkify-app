import { elementStrings } from './elements';

export const renderLoader = (parentEl) => {
  const loader = `
    <div class="${elementStrings.loader}">
      <svg>
        <use href="./img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parentEl.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = (parentEl) => {
  const loader = parentEl.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    parentEl.removeChild(loader);
  }
};
