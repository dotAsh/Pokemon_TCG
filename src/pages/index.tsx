
import { useState } from "react";
import { getAllSets } from "@/service/pokemon.service";
import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";
import PokemonSlider from "../components/PokemonSlider";
import { GetStaticProps } from "next";
import { useSets } from "@/hooks/react-query-hooks";
import { DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";
import { QueryKeys } from "@/models/enums";
import PokemonSetCard from "../components/PokemonSetCard";




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

const Home = () => {
  const { data: sets, isLoading, isError } = useSets();
  const [selectedSet, setSelectedSet] = useState<Set | null>(null);
  const sortedSets = sets?sets.sort((a: Set, b:Set) =>
    new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  ):[];
  return (
    <>
      <div className="w-[80%] mx-auto">
        <PokemonSlider />
      </div>
      <div className="px-3 flex flex-wrap pt-5">
        {isLoading && "Loading...."}
        {sets?.map((set) => (
          <PokemonSetCard key={set.id} set={set} setSelectedSet={setSelectedSet} />
        ))}
        {isError && "Error"}
      </div>
    </>
  );
};

export default Home;
