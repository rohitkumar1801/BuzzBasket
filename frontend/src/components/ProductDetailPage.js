import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  Package,
  Truck,
  RotateCcw,
  Shield,
  AlertTriangle,
  Plus,
  Minus,
  ShoppingCart,
  Loader,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { handleItemQtyInCart } from "../slice/cartSlice";
import LoginPopup from "./LoginPopup";


const ProductDetailPage = () => {
  const { id } = useParams();

  const loggedInUser = useSelector((store) => store.user.loggedInUser);
  const cartItems = useSelector((store) => store.cart.cartItems);

  console.log("cartItems", id);
  const isProductInCart = useMemo(() => {
    const res = cartItems?.items?.some((item) => item.product._id === id);
    console.log("isProductInCart", res);
    return res;
  }, [cartItems, id]);

  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProductById = async (id) => {
      const res = await fetch(`http://localhost:8080/products/${id}`);
      const data = await res.json();
      setProduct(data.product);
    };
    getProductById(id);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : i < rating
                ? "text-yellow-400 fill-current opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-500">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  const handleAddToCart = async () => {
    if (loggedInUser) {
      setIsLoading(true);
      await dispatch(handleItemQtyInCart({ productId: id, quantity: quantity }));
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Simulating a delay for the loading effect
    } else {
      setShowLoginPopup(true);
    }
  };

  const CartButton = () => {
    const baseButtonClasses = `flex items-center justify-center w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500`;

    if (isLoading) {
      return (
        <button className={`flex items-center justify-center w-${1/3} bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500
 animate-pulse`}>
          <Loader className="animate-spin mr-2" size={20} />
          <span>Processing...</span>
        </button>
      );
    }

    if (isProductInCart) {
      return (
        <Link to="/cart" className="block w-1/3">
          <button className={baseButtonClasses}>
            <ShoppingCart size={20} className="mr-2" />
            <span>Go to Cart</span>
          </button>
        </Link>
      );
    }

    return (
      <button
        onClick={handleAddToCart}
        className={ `flex items-center justify-center w-${1/3} bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      >
        <ShoppingCart size={20} className="mr-2" />
        <span>Add to Cart</span>
      </button>
    );
  };



  
  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  

  const handleLogin = (username, password) => {
    // Implement your login logic here
    console.log(
      `Logging in with username: ${username} and password: ${password}`
    );
    // After successful login:
    // setIsLoggedIn(true);
    setShowLoginPopup(false);
  };


  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <div className="mb-4">
                <img
                  src={product.images[currentImage] || product.thumbnail}
                  alt={product.title}
                  className="w-full h-96 object-contain rounded-lg bg-gray-100"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} - ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer bg-gray-100 ${
                      currentImage === index ? "border-2 border-blue-500 " : ""
                    }`}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                {product.category}
              </div>
              <h1 className="mt-1 text-4xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
              <div className="mt-2">{renderStars(product.rating)}</div>
              <p className="mt-4 text-gray-600">{product.description}</p>
              <div className="mt-4 flex items-center">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="ml-2 text-2xl text-gray-500 line-through">
                      $
                      {(
                        product.price /
                        (1 - product.discountPercentage / 100)
                      ).toFixed(2)}
                    </span>
                    <span className="ml-2 text-lg text-green-600">
                      ({product.discountPercentage}% off)
                    </span>
                  </>
                )}
              </div>
              <div className="mt-6 space-y-4">
                {!isProductInCart && (
                  <div className="flex items-center justify-start">
                    <span className="mr-4 text-gray-700">Quantity:</span>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="px-4 font-medium">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex justify-start w-full">
                  <CartButton />
                </div>
              </div>
              <span className="mt-2 block text-sm text-gray-500">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Package className="mr-2 h-4 w-4" />
                    SKU: {product.sku}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Truck className="mr-2 h-4 w-4" />
                    {product.shippingInformation}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {product.returnPolicy}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Shield className="mr-2 h-4 w-4" />
                    {product.warrantyInformation}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-8 py-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Dimensions (W x H x D)
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {product.dimensions.width}
                  {`"`} x {product.dimensions.height}
                  {`"`} x {product.dimensions.depth}
                  {`"`}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {product.weight} lbs
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Minimum Order Quantity
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {product.minimumOrderQuantity}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {product.tags.join(", ")}
                </p>
              </div>
            </div>
          </div>
          <div className="px-8 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Customer Reviews
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    {review.reviewerName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {review.reviewerName}
                    </h3>
                    <div className="mt-1">{renderStars(review.rating)}</div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {product.availabilityStatus === "Low Stock" && (
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle
                  className="h-5 w-5 text-yellow-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Low Stock Alert:</span> This
                  item is running low on stock. Order soon to avoid
                  disappointment!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default ProductDetailPage;
