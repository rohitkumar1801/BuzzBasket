/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { IoStarSharp, IoStarHalfSharp } from "react-icons/io5";

// Shimmer component to simulate loading state
const Shimmer = () => (
  <div className="animate-pulse group relative block bg-white rounded-lg shadow-md overflow-hidden">
    <div className="aspect-w-1 aspect-h-1 w-full bg-gray-300 rounded-t-lg"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

// Function to render stars based on rating (supports decimals)
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <IoStarSharp key={i} className="text-yellow-500 w-5 h-5" />
      ))}
      {hasHalfStar && <IoStarHalfSharp className="text-yellow-500 w-5 h-5" />}
      {[...Array(emptyStars)].map((_, i) => (
        <IoStarSharp key={`empty-${i}`} className="text-gray-400 w-5 h-5" />
      ))}
    </div>
  );
};

const ProductList = ({ currentPage, setTotalItems }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  

 

  

  

  const getProducts = async () => {
    setLoading(true); 
    setError(null); 
    try {
      const res = await fetch(
        `http://localhost:8080/products?_page=${currentPage}&_limit=16`
      );
      const items = await res.headers.get("X-Total-Count");
      const data = await res.json();
      setProducts(data.products);
      setTotalItems(items);
    } catch (error) {
      setError(
        "Failed to fetch products. Please try again later.",
        error.message
      );
    }
    setLoading(false); // Set loading to false after fetching
  };

  useEffect(() => {
    getProducts();
  }, [currentPage]);

  return (
    <div className="bg-white py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
          All Products
        </h2>

        {/* Display error message if there is an error */}
        {error && <div className="text-red-600 text-center mb-6">{error}</div>}

        {/* Category */}

         

        {loading ? (
          // Show shimmer effect when loading
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {Array(products.length || 16) // Show 8 shimmer items regardless of products length
              .fill(0)
              .map((_, index) => (
                <Shimmer key={index} />
              ))}
          </div>
        ) : (
          // Show products once loading is complete
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products?.map((product) => (
              <a
                key={product._id}
                href={product?.href}
                className="group relative block bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                  <img
                    alt=""
                    src={product.thumbnail}
                    className="h-full w-full object-cover object-center group-hover:opacity-90"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mt-2 text-md text-gray-700 font-semibold">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    {/* Dynamic star rating */}
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                      <span className="ml-2 text-md text-gray-600">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="mt-1 text-md font-medium text-gray-900">
                      ${product.price}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 border border-gray-300 rounded-lg pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-300"></div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
