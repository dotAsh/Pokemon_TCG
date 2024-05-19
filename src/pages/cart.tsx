import Link from "next/link";
import Image from "next/image";
import useCounter from "@/hooks/react-query-hooks";

const Cart = () => {
  const cart = useCounter((state) => state.cart);
  const removeFromCart = useCounter((state) => state.removeFromCart);

  return (
    <div className="w-[80%] mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Cart</h1>
      {cart.length === 0 ? (
        <p>No items in cart yet.</p>
      ) : (
        cart.map((item) => (
          <div key={item.set.id} className="flex items-center mb-5">
            <div className="relative w-[125px] h-[100px]">
              <Image
                src={item.set.images.logo || ""}
                height={100}
                width={125}
                alt="set logo"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{item.set.name}</h2>
              <p>Quantity: {item.quantity}</p>
              <button
                className="text-red-500"
                onClick={() => removeFromCart(item.set.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
      
    </div>
  );
};

export default Cart;
