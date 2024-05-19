
import Image from "next/image";
import { SetProps } from "../types";
import useCounter from "@/hooks/react-query-hooks";

const SetModal: React.FC<SetProps> = ({ set, setSelectedSet }) => {
  const addToCart = useCounter((state) => state.addToCart);
  const openModal = () => setSelectedSet(set);

  return (
    <div className="flex flex-col h-24">
      <label htmlFor="my_modal_6" className="btn" onClick={openModal}>
        Quick View
      </label>
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          {set && (
            <>
              <Image
                src={set.images.logo || ""}
                height={300}
                width={300}
                alt="set logo"
                className="h-34"
              />
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {set.name || "loading...."}
              </h2>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {set.releaseDate || "loading...."}
              </h2>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {set.total || "loading...."}
              </h2>
              <button onClick={() => addToCart(set)} type="button">
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
  );
};

export default SetModal;
