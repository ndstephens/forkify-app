import axios from 'axios';
import * as config from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    const url = `http://food2fork.com/api/get?key=${config.APIkey}&rId=${this.id}`;

    const res = await axios(`${config.corsProxy}${url}`);

    this.title = res.data.recipe.title;
    this.author = res.data.recipe.publisher;
    this.img = res.data.recipe.image_url;
    this.url = res.data.recipe.source_url;
    this.ingredients = res.data.recipe.ingredients;
  }
  calcTime() {
    // Assume about 5 minutes per ingredient
    this.time = this.ingredients.length * 5;
  }
  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    // const unitNormArr = [
    //   ['tablespoon', 'tbsp'],
    //   ['tablespoons', 'tbsp'],
    //   ['tbsps', 'tbsp'],
    //   ['teaspoon', 'tsp'],
    //   ['teaspoons', 'tsp'],
    //   ['tsps', 'tsp'],
    //   ['ounce', 'oz'],
    //   ['ounces', 'oz'],
    //   ['ozs', 'oz'],
    //   ['cups', 'cup'],
    //   ['pound', 'lb'],
    //   ['pounds', 'lb'],
    //   ['lbs', 'lb'],
    //   ['kilogram', 'kg'],
    //   ['kilograms', 'kg'],
    //   ['kgs', 'kg'],
    //   ['gram', 'g'],
    //   ['grams', 'g'],
    // ];
    const unitNormArr = [
      ['tablespoon', 'Tbsp'],
      ['teaspoon', 'tsp'],
      ['ounce', 'oz'],
      ['pound', 'lb'],
      ['kilogram', 'kg'],
      ['gram', 'g'],
      ['grams', 'g'],
    ];
    const unitsArr = unitNormArr.map((unit) => unit[1]);
    const unitsNormalizedArr = [...unitsArr, 'Tbsps', 'tsps', 'ozs', 'cups', 'cup', 'lbs', 'kgs'];

    const parsedIngredients = this.ingredients.map((item) => {
      // Remove any dashes and put entire ingredient string to lowercase
      let ingrStr = item.replace('-', ' ').toLowerCase();

      // Remove parenthesis, and all text within them, from each ingredient
      ingrStr = ingrStr.replace(/ *\([^)]*\)/g, '');

      // Replace all verbose units with shorter normalized versions
      unitNormArr.forEach((unit) => {
        ingrStr = ingrStr.replace(unit[0], unit[1]);
      });

      // Split ingredient string into an array
      const ingrArr = ingrStr.split(' ');
      // Look for any normalized unit and get its index
      const unitIndex = ingrArr.findIndex((unit2) => unitsNormalizedArr.includes(unit2));
      // Create an object to hold each ingredient's quantity, unit, and description
      let ingrObj = {};

      // Parse ingredient into quantity, unit, and description
      if (unitIndex > -1) {
        // If there is a unit
        // Check if start of ingredient is a number
        const quantityIndex = this.evalInput(ingrArr[0]) ? 0 : 1;
        ingrObj = {
          // All indexes before the unit are the quantity
          quantity: this.capDecimal(eval(ingrArr.slice(quantityIndex, unitIndex).join('+'))),
          unit: ingrArr[unitIndex],
          description: ingrArr.slice(unitIndex + 1).join(' '),
        };
      } else if (this.evalInput(ingrArr[0])) {
        // No unit, but first element is a number or fraction (quantity)
        // First check if second element is also a number (or fraction) (ex. 3 1/2)
        if (this.evalInput(ingrArr[1])) {
          ingrObj = {
            quantity: this.capDecimal(eval(`${ingrArr[0]}+${ingrArr[1]}`)),
            unit: '',
            description: ingrArr.slice(2).join(' '),
          };
        } else {
          ingrObj = {
            quantity: this.capDecimal(eval(`${ingrArr[0]}`)),
            unit: '',
            description: ingrArr.slice(1).join(' '),
          };
        }
      } else {
        // No unit and no initial number (quantity)
        ingrObj = {
          quantity: 1,
          unit: '',
          description: ingrStr,
        };
      }

      return ingrObj;
    });
    this.ingredients = parsedIngredients;
  }

  evalInput(input) {
    // Checks input (including fractions and equations) to see if it can evaluate to a number
    try {
      return typeof eval(input) === 'number';
    } catch (error) {
      return false;
    }
  }

  capDecimal(num) {
    // Cap decimals to 5 digits and round, but don't add zeros to shorter decimals
    if (typeof num === 'number') {
      return +(Math.round(num + 'e+5') + 'e-5');
    }
  }

  updateServings(type) {
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach((ingr) => {
      ingr.quantity = this.capDecimal(ingr.quantity * (newServings / this.servings));
    });

    this.servings = newServings;
  }
}
