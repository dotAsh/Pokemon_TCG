import { getAllSets } from "@/service/pokemon.service"
import { useEffect } from "react"

const BookList = () =>{
  useEffect (()=>{
    getAllSets().then((allsets)=>{console.log(allsets)})
  },[]);
  return <></>
}

export default BookList;
