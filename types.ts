import {Document} from 'mongoose'

export type NestedRecipe = Recipe
export type RecipeID = string

export interface Recipe {
  name: string,
  keywords: string[],
  recipeYield: string,
  recipeIngredient: string[],
  image: string,
  recipeInstructions: string[],
  author: string,
  url: string,
  id: string,
  notes: string[],
  origin: UserSchema['username']
  publisher:string,
  [k: string]:any
}

export interface Options {
  ['nameChange']: {},
  ["addNote"]: {},
  ["deleteNote"]:{},

}


export interface UserSchema {
id?:string,
email:string,
password:string,
username:string,
recipeStore:Recipe[]
}

export interface TokenSchema extends Document {
  token: string
  }