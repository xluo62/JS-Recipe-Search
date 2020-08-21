import Search from './models/Search';
import Recipe from './models/Rercipe';
import List from './models/List';
import {elements, loadSpinner, clearSpinner} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import Like from './models/Like';
const state = {};
/** 
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    //1.get query from view
    const query = searchView.getInput();
    

    if (query) {
        //2. new search obj and add to state
        state.search = new Search(query);
        //3. prepare UI for results
            //clear fields
        searchView.clearInput();
        searchView.clearList();
        loadSpinner(elements.searchRes);
        //4. search for recipes
        await state.search.getResults();
        
        //5. render results on UI
        setTimeout( check,1500);
       
        
    }
   
}
const check = () => {
    clearSpinner();
    searchView.renderResults(state.search.results);
}

elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
});


elements.searchPaginition.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearList();
        searchView.renderResults(state.search.results, gotoPage);
    } 
} );
// RECIPE CONROLLER

const controlRecipe = async () => {
    
    //get ID from url
    const id = window.location.hash.replace('#','');
    if (id) {
         // Prepare UI for changes
        recipeView.clearRecipe();
        loadSpinner(elements.recipe);
        // Highlight selected search item
        if (state.search) searchView.highlightItem(id);
        state.recipe = new Recipe(id);
        //window.r = state.recipe;
        try {   
            await state.recipe.getDetails();//1
            state.recipe.parseIngridients();//2
            
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            setTimeout( checkRecipe,1500);
           
        } catch (err) {
            console.log(err);
            alert(err);
        }
    }
    
}
const checkRecipe = () => {
    clearSpinner();
    recipeView.renderRecipe(state.recipe);
}
// List CONROLLER

const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) {
        state.list = new List();
        window.l = state.list;
    }
     // Add each ingredient to the list and UI
    state.recipe.results.ingredients.forEach(el => {
        listView.renderItem(state.list.addItem(el.count, el.unit, el.ingredient));
    });
}

//Like Controller
const controlLike = () => {
    if (!state.like) {
        state.like = new Like();
        window.like = state.like;
    }
    const currentID = state.recipe.ID;

    if (state.like.isLiked(currentID)) {
        //item that is liked
        state.like.deleteLike(currentID);
        console.log('dislike' + state.like);
    } else {
        //item that is not liked
       const like = state.like.addLike(currentID, state.recipe.results.publisher,
                state.recipe.results.title, state.recipe.results.image_url);
        console.log(like);
    }
}

// add event listener for many events
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
//
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
       
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        console.log('sssss');
        controlLike();
    }
});




elements.shoppingList.addEventListener('click', e => {
    
    // all of sequential operations need id no matter we click any place
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete button

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
       //delete from state
       
       state.list.deleteItem(id);
       //delete from view
       listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
        
    }
});