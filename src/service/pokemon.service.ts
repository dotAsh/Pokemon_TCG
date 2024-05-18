import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
export const getAllSets =  async () =>{
  let allSets = await PokemonTCG.getAllSets();
  return allSets;
}



export const getSetById = async (setId: string ) => {
  let set = await PokemonTCG.findSetByID(setId)
  return set;
}

export const editSetName = async (setId: string, setName: string) => {
  // let set = await PokemonTCG.findSetByID(setId);
   return new Promise((resolve, reject) => {
     // do some async task
     resolve("set edited");
   });
 };



