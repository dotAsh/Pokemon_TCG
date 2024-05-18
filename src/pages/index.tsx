import { useState, useEffect } from "react";
import { getAllSets } from "@/service/pokemon.service";
import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";
import Image from "next/image";
import useCounter from "@/hooks/react-query-hooks";
import PokemonSlider from '../components/PokemonSlider';

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps,
} from "next";

import { useSets, useUpdateSetsName } from "@/hooks/react-query-hooks";
import { DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";
import { QueryKeys } from "@/models/enums";
import Link from "next/link";
import { useRouter } from "next/router";

export const getStaticProps: GetStaticProps<{
  dehydratedState: DehydratedState;
}> = async () => {
  console.log("I AM SERVER");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.sets],
    queryFn: async () => {
      const sets = await getAllSets();
      return sets;
    },
  });
  console.log("I am from server");
  return { props: { dehydratedState: dehydrate(queryClient) }, revalidate: 30 };
};
/*
export default function Home() {
  
  return (
   
         //<Header></Header>
         //<BookList></BookList>
         //<WindowSizeComponent />

         <>
            <h1>hello from index.tsx</h1>
         </>
  );
}
*/

const Home = (props: { serverSets: Set[] }) => {
  console.log(props);

  const { data: sets, isLoading, isError } = useSets();
  const increment = useCounter((state) => state.increment);
  const { mutate: updateName } = useUpdateSetsName();
  const [setName, setSetName] = useState("");
  return (
    <>
     <div className="w-[80%] mx-auto">
     <PokemonSlider />
     </div>
     

      <div className="px-3 flex flex-wrap pt-5">
        {isLoading && "Loading...."}

        {sets?.map((set) => {
          return (
            <div key={set.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              <Link key={set.id} href={`/${set.id}`}>
                <div className=" max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <div className="relative mx-auto w-[125px] h-[100px]">
                    <Image
                      src={set?.images.logo || ""}
                      height={300} width={300}
                      alt="set logo"
                    ></Image>
                  </div>
                  <div className="text-center p-5  h-[100px]">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {set?.name || "loading...."}
                    </h2>
                  </div>
                </div>
              </Link>

              <div className="flex flex-col">
                {/* The button to open modal */}
                <label htmlFor="my_modal_6" className="btn">
                  Quick View
                </label>

                {/* Put this part before </body> tag */}
                <input
                  type="checkbox"
                  id="my_modal_6"
                  className="modal-toggle"
                />
                <div className="modal" role="dialog">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Book title!</h3>
                    <p className="py-4">Book Info!</p>
                    <button
                      onClick={() => {
                        increment(1);
                      }}
                      type="button"
                    >
                      Add to Cart
                    </button>
                    <div className="modal-action">
                      <label htmlFor="my_modal_6" className="btn">
                        Close!
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isError && "Error"}
      </div>
      <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
    </>
  );
};
export default Home;
