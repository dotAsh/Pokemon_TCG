
/*
import React, { useState, useEffect } from "react";
import { getAllSets } from "@/service/pokemon.service";
import { Book } from "@/components/Book";
import { BookProps } from "@/components/models/practice";
import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";

export const BookList = () => {
  const [sets, setSets] = useState<Set[]>([]);

  useEffect(() => {
    getAllSets().then((allSets) => {
     
      setSets(allSets);
    });
  }, []);

  return (
    <div className="flex flex-wrap justify-center">
      <div className="w-full text-center">This is the book list</div>
      {sets.map((book) => (
        <div key={book.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
          <Book bookProps={book} />
        </div>
      ))}
    </div>
  );
};

export default BookList; */

//SSG
import { useState, useEffect } from "react";
import { getAllSets } from "@/service/pokemon.service";
import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";
import Image from "next/image"


import { GetServerSideProps, GetServerSidePropsContext, GetStaticProps } from "next";

//SSR = getServerSideProps
//SSG / ISR = getStaticProps

export const getStaticProps: GetStaticProps<{serverSets: Set[];}> = async (context) =>{
        console.log("I AM SERVER");

        //const tempSets = null as unknown as Set[];
        let returnVal = null as unknown as Set[];

        try{
            const tempSets = await getAllSets();
            //throw new Error("custom error");
            returnVal = tempSets;
        }catch (e){
            console.log(e);
            return {notFound: true, revalidate: 1200};
        }
        return {props: {serverSets: returnVal} , revalidate: 30};
}

const SetList = (props: {serverSets: Set[]}) => {
    console.log(props);
    const [sets,setSets] = useState<Set[]> (props.serverSets);
    const setInit = async () => {
        try{
            const tempSets = await getAllSets();
            setSets(tempSets);
        }catch(e){
            console.log(e);
        }
    };
    useEffect (()=>{
        if(!sets){
          //setInit();
        }
    },[]);
    return (
        <div className="px-3 flex flex-wrap">
            {!sets && "Loading...."}
            {sets?.map((set) =>{
               return (
                  <div key={set.id} className="flex px-3 flex-col">
                      <div className="relative w-[100px] h-[100px]">
                            <Image src={set?.images.logo || ""} fill alt="set logo"></Image>
                      </div>
                      <div className="">{set?.name || "loading...."}</div>
                  </div>
               );
                      
              })}
        </div>
    );
  
}
export default SetList;




