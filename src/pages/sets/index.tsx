import { useState, useEffect } from "react";
import { getAllSets } from "@/service/pokemon.service";
import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";
import Image from "next/image";

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

const SetList = (props: { serverSets: Set[] }) => {
  console.log(props);

  const { data: sets, isLoading, isError } = useSets();

  const { mutate: updateName } = useUpdateSetsName();
  const [setName, setSetName] = useState("");
  return (
    <div className="px-3 flex flex-wrap">
      {isLoading && "Loading...."}

      {sets?.map((set) => {
        return (
          <div key={set.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
            <Link href={`sets/${set.id}`}>
              <div  className="flex px-3 flex-col">
                <div className="relative w-[100px] h-[100px]">
                  <Image
                    src={set?.images.logo || ""}
                    fill
                    alt="set logo"
                  ></Image>
                </div>
                <div className="">{set?.name || "loading...."}</div>
              </div>
            </Link>
            <div className="flex flex-col">
              <input
                name="set-name"
                type="text"
                placeholder="Edit Set Name"
                onKeyUp={(e) => {
                  setSetName(e.currentTarget.value);
                }}
              />
              <button 
              className="text-left"
                onClick={() => {
                  if (setName) {
                    updateName({
                      setId: set.id as string,
                      setName: setName,
                    });
                  }
                }}
              >Update Set Name
              </button>
            </div>
          </div>
        );
      })}
      {isError && "Error"}
    </div>
  );
};
export default SetList;
