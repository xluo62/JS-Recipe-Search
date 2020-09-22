import { elements } from './base';
import { tailorTitle } from './searchView';
export const toggleLikeButton = (isLiked) => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.header__likes use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const toggleLikeMenu = (numLikes) => {
    elements.likesMenu.style.visibility = numLikes ? 'visible' : 'hidden';
}

export const renderLikeItem = (like) => {
    const markUp = 
    `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${tailorTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
    `
    elements.likesList.insertAdjacentHTML('beforeend', markUp);
}

export const deleteLikeItem = id => {
   const el = document.querySelector(`.likes__link[href="#${id}"]`).parentNode;
   if (el) el.parentNode.removeChild(el);
}