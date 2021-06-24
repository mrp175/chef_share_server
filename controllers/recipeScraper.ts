import cheerio from 'cheerio';
import fetch, {RequestInit} from 'node-fetch';
import _ from 'lodash';
const User = require('../models/user');
import { v4 } from 'uuid';
import {Request, Response} from 'express'
import {Recipe} from '../types'


const fetchWithTimeout = (url:string, options?:RequestInit, timeout = 5000):Promise<any> => {
  return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), timeout)
      )
  ]);
}

const fetchHtml = (url:string) => {
  return fetchWithTimeout(url).then((res) => res.text());
}

const parseHtml = (html:string) => {
  const $ = cheerio.load(html);
  const jsonld = $('script[type="application/ld+json"]').html();
  if (!jsonld) return false;
  const recipe = JSON.parse(jsonld);

  let nestedRecipe:any = {};
  if (!recipe.hasOwnProperty('recipeIngredient')) {
    console.log('i was nested');
    if (Array.isArray(recipe)){
      nestedRecipe = recipe.filter(obj => obj['@type'] === 'Recipe')[0];
    } else if (nestedRecipe !== {}) {
      nestedRecipe = recipe['@graph'].filter((obj:any) => obj['@type'] === 'Recipe')[0];
    }
  }

  if (recipe.recipeIngredient) {
    return recipe;
  } else if (nestedRecipe.recipeIngredient) {
    return nestedRecipe;
  } else {
    return false;
  }
}

const extractData = (jsonld:any):Recipe => {
  const desiredKeys = ['name','keywords','recipeYield', 'recipeIngredient','image', 'recipeInstructions', 'publisher', 'author']
  const recipe:Recipe = {name:'', keywords:[],recipeYield:'',recipeIngredient:[], image:'', recipeInstructions:[], publisher:'',author:'', url:'', id:'', notes:[], origin:''}

  for (let key of desiredKeys) {
    if (jsonld.hasOwnProperty(key)) {

      if (key === 'keywords' && typeof jsonld[key] === 'string') {
        recipe[key] = jsonld[key].split(',');

      } else if (key === 'image' && Array.isArray(jsonld[key])) {
        recipe[key] = jsonld[key][0];

      } else if (key === 'image' && jsonld[key].hasOwnProperty('url')) {
        recipe[key] = jsonld[key].url;

      } else if (key === 'recipeYield' && typeof jsonld[key] !== 'string') {
        recipe[key] = '';

      } else if (key === 'recipeInstructions') {
        recipe[key] = jsonld[key].map((obj:any) => obj.text);

      } else if (key === 'publisher') {
        if (jsonld[key].hasOwnProperty('name')) recipe[key] = jsonld[key].name;

      } else if (key === 'author') {
        if (Array.isArray(jsonld[key])) {
          recipe[key] = jsonld[key].map((obj:any) => obj.name).join(',');
        } else if (jsonld[key].hasOwnProperty('name')) {
          recipe[key] = jsonld[key].name;
        }

      } else {
        recipe[key] = jsonld[key]
      }
    }
  }

  return recipe;
}


const handleScrape = async (req:Request, res:Response):Promise<void> => {
  try {
    const html = await fetchHtml(req.body.url);
    const jsonld = parseHtml(html);
    if(!jsonld) throw new Error('no json ld');

    const recipe = extractData(jsonld);
    recipe.url = req.body.url
    recipe.id = v4();
    recipe.notes = [];

    const user = await User.findById(req.body._id);
    recipe.origin = user.username;

    // save to user document
    await User.findByIdAndUpdate(req.body._id, {$push: {recipeStore: recipe}}, {new: true});
    res.status(200).json(recipe);

  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }

}






module.exports = { handleScrape}