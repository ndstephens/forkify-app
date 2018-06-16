import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults() {
    const APIkey = 'b71405dd35fc666359152303dd6e0647';
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const url = `http://food2fork.com/api/search?key=${APIkey}&q=${this.query}`;

    try {
      const res = await axios(`${corsProxy}${url}`);
      this.result = res.data.recipes;
      console.log(this.result);
    } catch (error) {
      console.log(error);
    }
  }
}
