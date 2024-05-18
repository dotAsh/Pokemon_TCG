
/*
import Image from "next/image";
import {useRouter} from "next/router";
import { getSetById } from "@/service/pokemon.service";
import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { useEffect, useState } from "react";


//SSR - getServerSideProps
//SSG - getStaticProps
//ISR - getStaticProps + getStaticProps

const SetPage = () => {
          const router = useRouter();
          console.log("im in set page");
          console.log(router);
          const [set, setSet] = useState<Set>();
          useEffect(() =>{
              let setId = router.query.setid as string;

              console.log(setId);
              if(setId){
                  getSetById(setId)
                  .then((x) => {
                      setSet(x);
                      console.log(x);
                  }).catch((x) => {});
              }
              console.log("********************");
          },[router.query?.setid]);

  return (
      <div className="flex h-full">
          <div className="flex flex-col items-center justify-center flex-grow">
              <div className="relative w-[100px] h-[100px]">
                    <Image   src={set?.images.logo||""} width={100} height ={100} alt="set logo"></Image>
              </div>
    
              <div className="">{set?.name || "loding..."}</div>
          </div>
      </div>
  );
  
};
export default SetPage;
*/

//ssg
/*
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, FC } from "react";
import { QueryClient, dehydrate, useQueryClient } from '@tanstack/react-query';
import { getSetById } from "@/service/pokemon.service";
import { Set, getAllSets } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { GetStaticProps, GetStaticPaths } from "next";
import { QueryKeys } from "@/models/enums";
import { useSetById } from "@/hooks/react-query-hooks";




export const getStaticPaths: GetStaticPaths = async (context) => {
  let allSets = await getAllSets();
  let listOfSetIdObjects = allSets.map((x) => {
    return { params: { setid: x.id } };
  });

  return { paths: listOfSetIdObjects.splice(0, 10), fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<{ serverSet: Set }> = async (context) => {
  console.log("I AM SERVER");
  
  let returnVal = null as unknown as Set;
  try {
    const tempSet = await getSetById(context.params?.setid as string);
    //throw new Error("custom error");
    returnVal = tempSet;
  } catch (e) {
    console.log(e);
    //return {notFound: true, revalidate: 1200}
  }
  return { props: { serverSet: returnVal }, revalidate: 120 };
};
const SetPage: FC<{ serverSet: Set }> = ({ serverSet }) => {
  const router = useRouter();
  console.log("i m in set Page");
  const [set, setSet] = useState<Set>(serverSet);
  console.log(serverSet, "outside", set);
  useEffect(() => {
    console.log(serverSet, "inside");
    if (serverSet) {
      setSet(serverSet);
    }
  }, [serverSet]);
  return (
    <div className="flex h-full">
      {router.isFallback ? (
        <>Fallback Loading</>
      ) : (
        <div key={set.id} className="flex px-3 flex-col">
          <div className="relative w-[100px] h-[100px]">
            <Image src={set?.images.logo || ""} fill alt="set logo"></Image>
          </div>
          <div className="">{set?.name || "loading...."}</div>
        </div>
      )}
    </div>
  );
};
export default SetPage;
*/


//ssg with prefetch
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, FC } from "react";
import { DehydratedState, QueryClient, dehydrate, useQueryClient } from '@tanstack/react-query';
import { getSetById } from "@/service/pokemon.service";
import { Set, getAllSets } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { GetStaticProps, GetStaticPaths } from "next";
import { QueryKeys } from "@/models/enums";
import { useSet, useUpdateSetName } from "@/hooks/react-query-hooks";



export const getStaticPaths: GetStaticPaths = async (context) => {
  let allSets = await getAllSets();
  console.log(allSets);
  let listOfSetIdObjects = allSets.map((x) => {
    return { params: { setid : x.id } };
  });
  return { paths: listOfSetIdObjects.splice(0, 10), fallback: "blocking" };
};



export const getStaticProps: GetStaticProps<{dehydratedState : DehydratedState}> = async (context) => {
  console.log("I AM SERVER");
  
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.set, context?.params?.setid],
    queryFn: async () =>{
      const set = await getSetById(context?.params?.setid as string);
      return set;
    },
  });
								  
  return { props: { dehydratedState: dehydrate(queryClient) }, revalidate: 120 };
};

												 

const SetPage: FC<any> = ({ serverSet }) => {
  const router = useRouter(); 
  const { data: set, isLoading, isError } = useSet(router.query.setid as string);
console.log(set);
   console.log(set, isLoading );
 
   
  
																				   
 
const { mutate: updateName } = useUpdateSetName();
  const [setName, setSetName] = useState(set?.name);
  return (
    <div className="flex h-full">
       {isLoading && "Loading...."}
      <div key={set?.id} className="flex px-3 flex-col">
        <div className="relative w-[100px] h-[100px]">
          <Image src={set?.images?.logo || ""} fill alt="set logo"  />
        </div>
        <div>{set?.name || "Loading..."}</div>
      </div>

      {isError && "Error"}

      <div>
            <input
              name="set-name"
              type="text"
              placeholder="Edit Set Name"
              onKeyUp={(e) => {
                setSetName(e.currentTarget.value);
              }}
            />
            <button
              onClick={() => {
                if (setName) {
                  updateName({
                    setId: router.query.setid as string,
                    setName: setName,
                  });
                }
              }}
            >Edit Set Name</button>
          </div>
    </div>
  );
};

 
export default SetPage;



//SSR
/*
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, FC } from "react";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { getSetById } from "@/service/pokemon.service";
import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { QueryKeys } from "@/models/enums";
import { useSet } from "@/hooks/react-query-hooks";

const SetPage: FC<{ serverSet: Set }> = ({ serverSet }) => {
  const router = useRouter();
  const [set, setSet] = useState<Set>(serverSet);

  useEffect(() => {
    if (serverSet) {
      setSet(serverSet);
    }
  }, [serverSet]);

  return (
    <div className="flex h-full">
      {router.isFallback ? (
        <>Fallback Loading</>
      ) : (
        <div key={set.id} className="flex px-3 flex-col">
          <div className="relative w-[100px] h-[100px]">
            <Image src={set?.images.logo || ""} fill alt="set logo"></Image>
          </div>
          <div className="">{set?.name || "loading...."}</div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{ serverSet: Set  | null}> = async (context) => {
  console.log("I AM SERVER");

  let serverSet: Set|  null = null;

  try {
    serverSet = await getSetById(context.params?.setid as string);
  } catch (error) {
    console.error("Error fetching set:", error);
    
  }

  return { props: { serverSet } };
};

export default SetPage;

*/
