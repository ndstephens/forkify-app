import axios from 'axios';
import * as config from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults() {
    const url = `http://food2fork.com/api/search?key=${config.APIkey}&q=${this.query}`;

    const res = await axios(`${config.corsProxy}${url}`);
    this.result = res.data.recipes;
  }
}
