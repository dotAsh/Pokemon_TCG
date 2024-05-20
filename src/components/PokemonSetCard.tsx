
import Image from "next/image";
import Link from "next/link";
import { SetProps } from "../types";
import SetModal from "./SetModal";

const PokemonSetCard: React.FC<SetProps> = ({ set, setSelectedSet }) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
      <Link href={`/${set.id}`}>
        <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="mx-auto relative w-[200px]  h-[250px]">
            <Image
              src={set.images.logo || ""}
              height={300}
              width={300}
              alt="set logo"
              className="h-44"
              
            />
          </div>
          <div className="text-center p-5  h-[100px]">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {set.name || "loading...."}
            </h2>
          </div>
        </div>
      </Link>
      <SetModal set={set} setSelectedSet={setSelectedSet} />
    </div>
  );
};

export default PokemonSetCard;
