import {gql} from 'apollo-boost'
//การทำ Fragment เป็นการนำฟิลด์ที่ใช่คล้ายกันมาเก็บไว้แล้วเรียกเฉพาะ fragment ไปใช่
export const recipeFragment = {
  recipe: gql`
  fragment CompleteRecipe on Recipe {
    _id
    name
    category
    description
    instructions
    createdDate
    likes
    username
  }
  `,
  like: gql`
  fragment LikeRecipe on Recipe {
    id
    likes
  }
  `
}