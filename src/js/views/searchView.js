import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => { elements.searchInput.value = '';}

export const clearList = () => {elements.searchList.innerHTML = '';
elements.searchPaginition.innerHTML = '';}
let tempID;
export const highlightItem = id => {
    if (tempID) {
        document.querySelector(`.results__link[href="#${tempID}"]`).classList.remove('results__link--active');
    }
    tempID = id; 
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}



export const tailorTitle = (title, length = 17) => {
    const refinedTitle = [];
    if (title.length > length) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= length) {
                refinedTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return refinedTitle.join(' ') + '...';
    }
    return title;
}

const renderListItem = (item) => {
    const markUp = `
    <li>
        <a class="results__link " href="#${item.recipe_id}">
            <figure class="results__fig">
                <img src=${item.image_url} alt="${item.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${tailorTitle(item.title)}</h4>
                <p class="results__author">${item.publisher}</p>
            </div>
        </a>
    </li>
        `;
    elements.searchList.insertAdjacentHTML("beforeend", markUp);
}
const createBtn = (type, page) => (    `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
</button>
`)


const renderBtns = (page, numResults, resPerPage) => {
    const numOfPages = Math.ceil(numResults / resPerPage);
    let buttons;
    if (page === 1 && numOfPages > 1) {
        buttons = createBtn('next', page);
    } else if (page > 1 && page < numOfPages) {
        buttons = `${createBtn('prev', page)}
                    ${createBtn('next', page)}`;
    } else if (page === numOfPages && numOfPages > 1) {
        buttons = createBtn('prev', page);
    }

    elements.searchPaginition.insertAdjacentHTML('afterbegin', buttons);
}
export const renderResults = (list, page = 1, numberOnPage = 10) => {

    const start = (page - 1) * numberOnPage;
    const end = page * numberOnPage;

    list.slice(start, end).forEach(renderListItem);
    renderBtns(page, list.length, numberOnPage);
}

