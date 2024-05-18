import { useState, useEffect } from "react";
import { getAllSets } from "@/service/pokemon.service";
import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";
import Image from "next/image";

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps,
} from "next";
import Book from "@/components/Book";

//SSR = getServerSideProps
//SSG / ISR = getStaticProps

export const getServerSideProps: GetServerSideProps<{serverSets: Set[];}> = async (context) => {
  console.log("I AM SERVER");

  //const tempSets = null as unknown as Set[];
  let returnVal = null as unknown as Set[];

  try {
    const tempSets = await getAllSets();
    //throw new Error("custom error");
    returnVal = tempSets;
  } catch (e) {
    console.log(e);
    return { notFound: true, revalidate: 1200 };
  }
  return { props: { serverSets: returnVal }, revalidate: 30 };
};

const SetList = (props: { serverSets: Set[] }) => {
  console.log(props);
  const [sets, setSets] = useState<Set[]>(props.serverSets);
  const setInit = async () => {
    try {
      const tempSets = await getAllSets();
      setSets(tempSets);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (!sets) {
      setInit();
    }
  });
  return (
    <div className="px-3 flex flex-wrap">
      {!sets && "Loading...."}
      {sets?.map((set) => {
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
};
export default SetList;
