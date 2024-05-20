import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, FC } from "react";
import {
  DehydratedState,
  QueryClient,
  dehydrate,
  useQueryClient,
} from "@tanstack/react-query";
import { getSetById } from "@/service/pokemon.service";
import { Set, getAllSets } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { GetStaticProps, GetStaticPaths } from "next";
import { QueryKeys } from "@/models/enums";
import useCounter, { useSet, useUpdateSetName } from "@/hooks/react-query-hooks";

export const getStaticPaths: GetStaticPaths = async (context) => {
  let allSets = await getAllSets();
  console.log(allSets);
  let listOfSetIdObjects = allSets.map((x) => {
    return { params: { setid: x.id } };
  });
  return { paths: listOfSetIdObjects.splice(0, 10), fallback: true };
};

export const getStaticProps: GetStaticProps<{
  dehydratedState: DehydratedState;
}> = async (context) => {
  console.log("I AM SERVER");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.set, context?.params?.setid],
    queryFn: async () => {
      const set = await getSetById(context?.params?.setid as string);
      return set;
    },
  });

  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: 120,
  };
};

const SetPage: FC<any> = ({ serverSet }) => {
  const router = useRouter();
  const {
    data: set,
    isLoading,
    isError,
  } = useSet(router.query.setid as string);



  const addToCart = useCounter<any>((state) => state.addToCart);
  const { mutate: updateName } = useUpdateSetName();
  const [setName, setSetName] = useState(set?.name);
  return (
    <div className="mx-auto flex h-full flex-col w-[50%]">
      {isLoading && "Loading...."}
      <div key={set?.id} className="mx-auto flex px-3 flex-col">
        <div className="relative w-[100px] h-[100px]">
          <Image src={set?.images?.logo || ""} fill alt="set logo" />
        </div>
        <div>{set?.name || "Loading..."}</div>
      </div>

      {isError && "Error"}

      <div className="mx-auto">
        <input
          name="set-name"
          onKeyUp={(e) => {
            setSetName(e.currentTarget.value);
          }}
          type="text"
          id="helper-text"
          aria-describedby="helper-text-explanation"
          className="  mb-2 mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
				focus:ring-blue-500 focus:border-blue-500 block w-full   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
				dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Edit Name"
        ></input>

        <button
          type="button"
          onClick={() => {
            if (setName) {
              updateName({
                setId: router.query.setid as string,
                setName: setName,
              });
            }
          }}
          className="w-[100%] bg-teal-600 px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Edit Name
        </button>
        <button  className="my-5 w-[100%] bg-teal-600 px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => addToCart(set)} type="button">
                Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SetPage;
