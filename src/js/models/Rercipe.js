import axios from 'axios';

export default class Recipe {
    constructor(ID) {
        this.ID = ID;
    }
    async getDetails() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.ID}`);
           
            this.results = res.data.recipe;
            // const test = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${this.ID}`);
            // const testb = await test.json();
            // window.testb = testb;
        } catch (err) {
            alert(err);
            console.log(err);
        }
    }
    calcTime() {
        //assumer every 3 ingredients take 15 mins
        this.time = Math.ceil(this.results.ingredients.length / 3) * 15;
    }
    calcServings() {
        this.servings = 4;
    }
    parseIngridients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'g', 'kg'];

        this.results.ingredients = this.results.ingredients.map(el => {
            // change units from long to short
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                //replace returns a new string
               ingredient = ingredient.replace(unit, unitsShort[i]);
            });
           
            //remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            // parse ingredients into count, unit and ingredient.
            const arrIng = ingredient.split(' ');
            const unitIndx =  arrIng.findIndex(el => units.includes(el));
            
            let objIng;
            if (unitIndx > -1) {
                if (!parseInt(arrIng[0])) {
                    objIng = {
                        count: 1,
                        unit: arrIng[unitIndx],
                        ingredient: arrIng.slice(unitIndx + 1).join(' ')
                    }
                } else {
                    const arrCount = arrIng.slice(0, unitIndx);
                    let count;
                    if (arrCount.length === 1) {
                        count = eval(arrCount[0].replace('-', '+'));
                    } else {
                        count = eval(arrCount.join('+'));
                    }
                    objIng = {
                        count,
                        unit: arrIng[unitIndx],
                        ingredient: arrIng.slice(unitIndx + 1).join(' ')
                    }
                }
               
            } else if (parseInt(arrIng[0], 10) ) {
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndx === -1) {
                
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
    }
    updateServings (type) {
        const newServings = type === 'inc' ? this.servings + 1 : this.servings - 1
        this.time = Math.ceil(this.time * (newServings / this.servings));

        this.results.ingredients.forEach(el => {
            if (el.count) {
                el.count *= (newServings / this.servings);
            }
        })
        this.servings = newServings;
    }
}
// const test = new Recipe(47746);
// const check = async () => {
//    await test.getDetails();
//     test.calcTime();
// };
// check();
