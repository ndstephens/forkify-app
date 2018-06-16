import axios from 'axios';

// const recipeUrl = `http://food2fork.com/api/get?key=${APIkey}`;

const getResults = async (query) => {
  const APIkey = 'b71405dd35fc666359152303dd6e0647';
  const corsProxy = 'https://cors-anywhere.herokuapp.com/';
  const url = `http://food2fork.com/api/search?key=${APIkey}&q=${query}`;

  try {
    const results = await axios(`${corsProxy}${url}`);
    const recipes = results.data.recipes;
    console.log(recipes);
  } catch (error) {
    console.log(error);
  }
};

getResults('pizza');
