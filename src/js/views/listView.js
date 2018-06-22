import { elements } from './elements';

export const renderItem = (item) => {
  const markup = `
    <li class="shopping__item" data-itemid="${item.id}">
      <div class="shopping__count">
        <input type="number" value="${item.quantity}" step="${item.quantity}"  min="0" class="shopping__count-value">
        <p>${item.unit}</p>
      </div>
      <p class="shopping__description">${item.description}</p>
      <button class="shopping__delete btn-tiny">
        <svg>
          <use href="img/icons.svg#icon-circle-with-cross"></use>
        </svg>
      </button>
    </li>
  `;
  elements.shoppingList.insertAdjacentHTML('beforeend', markup);
};

export const deleteItemUI = (id) => {
  const item = document.querySelector(`[data-itemid="${id}"`);
  if (item) {
    item.parentElement.removeChild(item);
  }
};
