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




interface CartItem {
  set: Set;
  quantity: number;
}

interface User {
  username: string;
  isLoggedIn: boolean;
}

interface CounterStore {
  count: number;
  cart: CartItem[];
  user: User | null;
  increment: (value: number) => void;
  decrement: (value: number) => void;
  reset: () => void;
  addToCart: (item: Set) => void;
  removeFromCart: (id: string) => void;
  login: (username: string) => void;
  logout: () => void;
}

const counterStore = (set: any) => ({
  count: 0,
  cart: [] as CartItem[],
  user: null as User | null,
  increment: (value: number) =>
    set((state: CounterStore) => ({ count: state.count + value })),
  decrement: (value: number) =>
    set((state: CounterStore) => ({ count: state.count - value })),
  reset: () => set({ count: 0 }),
  addToCart: (item: Set) =>
    set((state: CounterStore) => {
      const existingItem = state.cart.find((cartItem) => cartItem.set.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((cartItem) =>
            cartItem.set.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
          count: state.count + 1,
        };
      }
      return { cart: [...state.cart, { set: item, quantity: 1 }], count: state.count + 1 };
    }),
  removeFromCart: (id: string) =>
    set((state: CounterStore) => {
      const itemToRemove = state.cart.find((cartItem) => cartItem.set.id === id);
      if (!itemToRemove) return state;
      if (itemToRemove.quantity > 1) {
        return {
          cart: state.cart.map((cartItem) =>
            cartItem.set.id === id
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          ),
          count: state.count - 1,
        };
      }
      return { cart: state.cart.filter((cartItem) => cartItem.set.id !== id), count: state.count - 1 };
    }),
  login: (username: string) => set({ user: { username, isLoggedIn: true } }),
  logout: () => set({ user: null }),
});

const useCounter = create(
  devtools(
    persist(counterStore, {
      name: "counterStore",
    })
  )
);

export default useCounter;

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



