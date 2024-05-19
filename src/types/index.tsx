
import { DehydratedState } from "@tanstack/react-query";
import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";

export interface SetProps {
  set: Set;
  setSelectedSet: (set: Set | null) => void;
}

export interface HomeProps {
  dehydratedState: DehydratedState;
}
