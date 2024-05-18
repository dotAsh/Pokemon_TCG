import { QueryKeys } from "@/models/enums";
import { getAllSets } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { editSetName, getSetById } from "@/service/pokemon.service";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useSets = () => {
  return useQuery<Set[]>({
    queryKey: [QueryKeys.sets],
    queryFn: async () => {
      const sets = await getAllSets();
      return sets;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: true,
    retry: 1,
    retryDelay: 3000,
  });
};

export const useSet = (setid: string) => {
  return useQuery<Set>({
    queryKey: [QueryKeys.set, setid],
    queryFn: async () => {
      const set = await getSetById(setid);
      return set;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: true,
    retry: 1,
    retryDelay: 3000,
  });
};

const counterStore = (set: any) => ({
  count: 0,
  increment: (value: number) =>
    set((state: { count: number }) => ({ count: state.count + value })),
  decrement: (value: number) =>
    set((state: { count: number }) => ({ count: state.count - value })),
  reset: () => set({ count: 0 }),
});

/*
interface CounterState {
  count: number;
}

interface CounterActions {
  increment: (value: number) => void;
  decrement: (value: number) => void;
  reset: () => void;
}

const counterStore = (set: (state: CounterState) => void): CounterState & CounterActions => ({
  count: 0,
  increment: (value: number) =>
    set((state ) => ({ ...state, count: state.count + value })),
  decrement: (value: number) =>
    set((state) => ({ ...state, count: state.count - value })),
  reset: () => set({ count: 0 }),
});

*/
const useCounter = create(
  devtools(
    persist(counterStore, {
      name: "counterStore",
    })
  )
);
export default useCounter;


/*
export const useUpdateSetName = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ setId, setName }: { setId: string; setName: string }) =>{
      return editSetName(setId, setName);
    },
    onSuccess: (data, variables) => {
      console.log("successfully updated");
      queryClient.setQueryData([QueryKeys.set, variables.setId], (initialSet: any) => {
        
        if (initialSet) {
        initialSet.name = variables.setName;
        }
        return {...initialSet};
      });
      //queryClient.invalidateQueries({ queryKey: [QueryKeys.CardSets] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};*/

export const useUpdateSetName = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ setId, setName }: { setId: string; setName: string }) => {
      return editSetName(setId, setName);
    },
    onSuccess: (data, variables) => {
      console.log("successfully updated");
      queryClient.setQueryData(
        [QueryKeys.set, variables.setId],
        (initialSet: any) => {
          if (initialSet) {
            initialSet.name = variables.setName;
          }

          return { ...initialSet };
        }
      );
     // queryClient.invalidateQueries({
      // queryKey: [QueryKeys.set, variables.setId],
      // });
    },
    onError: (error) => {   
      console.log(error);
    },
  });
};

export const useUpdateSetsName = () => {
  const queryClient = useQueryClient();
  return useMutation({
  mutationFn: ({ setId, setName }: { setId: string; setName: string }) =>
  editSetName(setId, setName),
  onSuccess: (data, variables) => {
  console.log("successfully updated");
  queryClient.setQueryData([QueryKeys.sets], (initialSets: Set[]) => {
  let foundSet = initialSets?.find((set) => set.id === variables.setId);
  if (foundSet) {
  foundSet.name = variables.setName;
  }
  return initialSets;
  });
  //queryClient.invalidateQueries({ queryKey: [QueryKeys.CardSets] });
  },
  onError: (error) => {
  console.log(error);
  },
  });
 };

