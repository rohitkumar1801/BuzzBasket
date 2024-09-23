/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoStarSharp,
  IoStarHalfSharp,
  IoClose,
  IoFilterSharp,
  IoChevronDown,
} from "react-icons/io5";
import { fetchProducts } from "../slice/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCartByUserThunk } from "../slice/cartSlice";
import { Transition } from "@headlessui/react";

const Shimmer = ({ type }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className={`animate-pulse ${
      type === "product"
        ? "group relative block bg-white rounded-lg shadow-lg overflow-hidden"
        : "flex flex-col"
    }`}
  >
    {type === "product" ? (
      <>
        <div className="aspect-w-1 aspect-h-1 w-full bg-gray-300 rounded-t-lg"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </>
    ) : (
      <>
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="relative">
          <div className="bg-gray-300 h-12 rounded w-full mb-2"></div>
          <div className="absolute z-10 bg-gray-300 rounded mt-2 w-full max-h-60"></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="h-8 bg-gray-300 rounded w-1/2 mb-2"
              ></div>
            ))}
        </div>
        <div className="mt-8">
          <div className="bg-gray-300 h-8 rounded w-full"></div>
        </div>
      </>
    )}
  </motion.div>
);

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <IoStarSharp key={i} className="text-yellow-500 w-4 h-4" />
      ))}
      {hasHalfStar && <IoStarHalfSharp className="text-yellow-500 w-4 h-4" />}
      {[...Array(emptyStars)].map((_, i) => (
        <IoStarSharp key={`empty-${i}`} className="text-gray-400 w-4 h-4" />
      ))}
    </div>
  );
};

const sortOptions = [
  { name: "None", sort: "", order: "" },
  { name: "Best Rating", sort: "rating", order: "desc" },
  { name: "Price: Low to High", sort: "price", order: "asc" },
  { name: "Price: High to Low", sort: "price", order: "desc" },
];

const ProductList = ({ currentPage }) => {
  const loggedInUser = useSelector((store) => store.user.loggedInUser);
  const dispatch = useDispatch();
  const { products, brands } = useSelector((store) => store.product);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const [sortOption, setSortOption] = useState(sortOptions[0]);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const removeBrand = (brand) => {
    setSelectedBrands((prevSelectedBrands) =>
      prevSelectedBrands.filter((b) => b !== brand)
    );
  };

  const handleSortChange = (e) => {
    console.log("e...", e)
    const selectedValue = e.name;
    const selectedOption = sortOptions.find(
      (option) => option.name === selectedValue
    );
    setSortOption(selectedOption);
    setIsDropdownOpen((prev) => !prev);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prevSelectedBrands) =>
      prevSelectedBrands.includes(brand)
        ? prevSelectedBrands.filter((b) => b !== brand)
        : [...prevSelectedBrands, brand]
    );
  };

  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      await dispatch(
        fetchProducts({
          page: currentPage,
          category: selectedCategory,
          brand: selectedBrands.join(","),
          _sort: sortOption.sort,
          _order: sortOption.order,
        })
      );
      setLoading(false);
    };

    fetchProductsData();
  }, [currentPage, sortOption, selectedBrands, selectedCategory, dispatch]);

  return (
    <div className="bg-gray-100 py-10 min-h-screen">
      <div className="mx-auto w-full px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Sort by:
              </span>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="appearance-none cursor-pointer bg-white border border-gray-200 rounded-sm py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between w-48"
                >
                  <span>{sortOption.name}</span>
                  <IoChevronDown
                    className={`transition-transform duration-300 ${
                      isDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-sm">
                    {sortOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleSortChange(option)}
                        className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 text-sm text-gray-800"
                      >
                        {option.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-600 transition-colors duration-200"
            >
              <IoFilterSharp />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Filter section */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "25%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{
                  duration: 0.4, // Smoother duration
                  ease: [0.4, 0, 0.2, 1], // Custom easing for a smoother feel
                }}
                className="bg-white p-6 rounded-lg shadow-lg mb-6 md:mb-0 md:mr-6 overflow-hidden"
                layout // Enabling layout animation
              >
                <h2 className="font-semibold text-2xl mb-4">Filters</h2>

                <div className="mb-6">
                  <label
                    htmlFor="brands"
                    className="block font-semibold text-gray-600 mb-2"
                  >
                    Brands
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full text-left px-4 py-2 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition-colors duration-200"
                    >
                      Select Brands
                      <span className="float-right">
                        {isDropdownOpen ? "▲" : "▼"}
                      </span>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute z-10 bg-white border rounded-md mt-2 w-full max-h-60 overflow-y-auto shadow-lg">
                        {brands.length > 0 ? (
                          brands.map((brand, index) => (
                            <label
                              key={index}
                              className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                value={brand}
                                checked={selectedBrands.includes(brand)}
                                onChange={() => handleBrandChange(brand)}
                                className="mr-2"
                              />
                              {brand}
                            </label>
                          ))
                        ) : (
                          <p className="px-4 py-2 text-gray-500">
                            No brands available
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {selectedBrands.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-600 mb-2">
                      Selected Brands:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBrands.map((brand, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1"
                        >
                          <span className="mr-2">{brand}</span>
                          <button
                            onClick={() => removeBrand(brand)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IoClose className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add more filter options here */}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Cards section */}
          <motion.div
            layout
            className="flex-grow"
            animate={{ width: isFilterOpen ? "75%" : "100%" }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array(12)
                  .fill(0)
                  .map((_, index) => (
                    <Shimmer key={index} type="product" />
                  ))}
              </div>
            ) : (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
                  isFilterOpen ? `xl:grid-cols-3` : `xl:grid-cols-4`
                } gap-4`}
              >
                {products.length > 0 ? (
                  products.map((product) => {
                    const originalPrice = product.price;
                    const discountedPrice =
                      originalPrice -
                      (originalPrice * (product.discountPercentage || 0)) / 100;
                    return (
                      <motion.div
                        key={product._id}
                        layout
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Link
                          to={`/product-detail/${product._id}`}
                          className="block bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                        >
                          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                            <img
                              alt=""
                              src={product.thumbnail}
                              className="h-full w-full object-cover object-center transform transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                              {product.title}
                            </h3>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                {renderStars(product.rating)}
                                <span className="ml-1 text-xs font-medium text-gray-600">
                                  {product.rating.toFixed(1)}
                                </span>
                              </div>
                              <div className="flex flex-col items-end">
                                {product.discountPercentage > 0 ? (
                                  <>
                                    <p className="text-sm font-bold text-green-600">
                                      ${discountedPrice.toFixed(2)}
                                    </p>
                                    <p className="text-xs line-through text-gray-500">
                                      ${originalPrice.toFixed(2)}
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-sm font-bold text-gray-900">
                                    ${originalPrice.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })
                ) : (
                  <Transition
                    show={true}
                    enter="transition-opacity duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="col-span-full"
                  >
                    <div className="text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8 bg-white shadow-lg rounded-lg">
                      <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        <span className="block">No products available</span>
                      </h2>
                      <p className="mt-4 text-xl text-gray-600">
                        {`We're sorry, but there are currently no products that
                        match your criteria. Please try adjusting your filters
                        or check back later.`}
                      </p>
                      <div className="mt-8">
                        <button
                          onClick={() => {
                            setSelectedBrands([]);
                            setSortOption(sortOptions[0]);
                          }}
                          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  </Transition>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
