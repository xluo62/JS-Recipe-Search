
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchList: document.querySelector('.results__list'),
    searchPaginition: document.querySelector('.result_pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    test: document.querySelector('.recipe__ingredients')
}

const elementsString = {
    loader: 'loader'
}
export const loadSpinner = (parent) => {
    const markUp = `
    <div class=${elementsString.loader}>
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin', markUp);
}
export const clearSpinner = () => {
    const loader = document.querySelector(`.${elementsString.loader}`);
    if (loader)
    loader.parentNode.removeChild(loader);
}