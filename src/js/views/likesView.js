import { elements } from './elements';

export const toggleLikeBtn = (isLiked) => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = (numLikes) => {
  elements.likesMenu.style.visibility = numLikes ? 'visible' : 'hidden';
};

export const renderLike = (like) => {
  const markup = `
    <li>
      <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
          <img src="${like.img}" alt="${like.title}">
        </figure>
        <div class="likes__data">
          <h4 class="likes__name">${like.title}</h4>
          <p class="likes__author">${like.author}</p>
        </div>
      </a>
    </li>
  `;
  elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLikeUI = (id) => {
  const item = elements.likesList.querySelector(`.likes__link[href*="${id}"]`).parentElement;
  if (item) {
    item.parentElement.removeChild(item);
  }
};