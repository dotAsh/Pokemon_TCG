import { useState } from "react";
import { getAllSets } from "@/service/pokemon.service";
import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";
import Image from "next/image";
import useCounter from "@/hooks/react-query-hooks";
import PokemonSlider from "../components/PokemonSlider";
import { GetStaticProps } from "next";
import { useSets } from "@/hooks/react-query-hooks";
import { DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";
import { QueryKeys } from "@/models/enums";
import Link from "next/link";

export const getStaticProps: GetStaticProps<{
  dehydratedState: DehydratedState;
}> = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.sets],
    queryFn: async () => {
      const sets = await getAllSets();
      return sets;
    },
  });
  return { props: { dehydratedState: dehydrate(queryClient) }, revalidate: 30 };
};

const Home = (props: { serverSets: Set[] }) => {
  const { data: sets, isLoading, isError } = useSets();
  const addToCart = useCounter((state) => state.addToCart);
  
  const [selectedSet, setSelectedSet] = useState<Set | null>(null);

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
                <div className="  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <div className="relative mx-[100px]  h-[100px]">
                    <Image
                      src={set?.images.logo || ""}
                      height={300}
                      width={300}
                      alt="set logo"
                      className="h-24"
                    ></Image>
                  </div>
                  <div className="text-center p-5  h-[100px]">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {set?.name || "loading...."}
                    </h2>
                  </div>
                </div>
              </Link>

              <div className="flex flex-col h-24">
                <label
                  htmlFor="my_modal_6"
                  className="btn"
                  onClick={() => setSelectedSet(set)}
                >
                  Quick View
                </label>

                <input
                  type="checkbox"
                  id="my_modal_6"
                  className="modal-toggle"
                />
                <div className="modal" role="dialog">
                  <div className="modal-box">
                    {selectedSet && (
                      <>
                        <Image
                          src={selectedSet.images.logo || ""}
                          height={300}
                          width={300}
                          alt="set logo"
                          className="h-34"
                        ></Image>
                        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {selectedSet.name || "loading...."}
                        </h2>
                        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {selectedSet.releaseDate || "loading...."}
                        </h2>
                        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {selectedSet.total || "loading...."}
                        </h2>
                        <button
                          onClick={() => {
                            addToCart(selectedSet);
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isError && "Error"}
      </div>
    </>
  );
};

export default Home;
