/* eslint-disable no-unused-vars */

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";



const Cart = () => {
  const { loggedInUser } = useSelector((store) => store.user);
  const { cartItems } = useSelector((store) => store.cart);
  
  const navigate = useNavigate();

 

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (!loggedInUser) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        <p className="text-lg mb-4">You need to <button onClick={handleLoginRedirect} className="text-blue-600 hover:underline">login</button> to view your cart.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems?.items?.length === 0 ? (
        <p className="text-lg">Your cart is empty.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {cartItems?.items?.map((item) => (
              <li key={item.product.id} className="flex items-center border-b pb-4 mb-4">
                <img src={item.product.thumbnail} alt={item.product.title} className="h-24 w-24 object-cover mr-4" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.product.title}</h3>
                  <p className="text-gray-600">Price: ${item.product.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button 
                    //   onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.product.quantity <= 1}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button 
                    //   onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 transition-colors duration-200"
                    >
                      +
                    </button>
                    <button 
                    //   onClick={() => handleRemoveItem(item.id)}
                      className="ml-4 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500 transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-lg font-semibold ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-end">
            <Link to="/checkout" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500 transition-colors duration-200">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
