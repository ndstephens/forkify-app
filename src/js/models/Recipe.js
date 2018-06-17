import axios from 'axios';
import * as config from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    const url = `http://food2fork.com/api/get?key=${config.APIkey}&rId=${this.id}`;

    try {
      const res = await axios(`${config.corsProxy}${url}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
    }
  }
  calcTime() {
    // Assume about 5 minutes per ingredient
    this.time = this.ingredients.length * 5;
  }
  calcServings() {
    this.servings = 4;
  }
}
