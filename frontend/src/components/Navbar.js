/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { fetchCategories } from "../slice/categorySlice";

const Navbar = ({setSelectedCategory}) => {
  const { categories } = useSelector((store) => store.category);
  const dispatch = useDispatch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleCategory = (slug) => {
    setSelectedCategory(slug)
  }

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <header className="bg-gray-900 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-4">
          <img
            className="h-12 w-auto"
            src="../../logo-no-background.png"
            alt="BuzzBasket Logo"
          />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-300 hover:text-white">
            Home
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Products
          </a>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="text-gray-300 hover:text-white focus:outline-none">
              Categories
            </button>

            {/* Dropdown Menu with Two Columns */}
            <div
              className={`absolute left-0 mt-2 w-80 bg-white text-gray-900 rounded-lg shadow-lg z-50 transition-all duration-300 transform ${
                isDropdownOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <ul className="py-2 grid grid-cols-3 gap-4 px-4">
                {categories?.map((category) => (
                  <li
                    key={category.id}
                    className="block py-1 text-sm font-semibold hover:text-gray-500 cursor-pointer"
                    onClick={() => handleCategory(category.slug)}
                  >
                    {/* <Link to={`/${category.slug}`}></Link> */}
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a href="#" className="text-gray-300 hover:text-white">
            About
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Contact
          </a>
        </nav>

        {/* Search Bar */}
        <div className="relative hidden md:flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 rounded bg-gray-800 text-gray-300 border border-gray-700 focus:outline-none"
          />
          <button className="absolute right-0 p-2 text-gray-300 hover:text-white">
            <FiSearch />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
