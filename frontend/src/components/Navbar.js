import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sample category data
  const categories = ["Electronics", "Fashion", "Home", "Books", "Toys"];

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

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
          <a href="#" className="text-gray-300 hover:text-white">Home</a>
          <a href="#" className="text-gray-300 hover:text-white">Products</a>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="text-gray-300 hover:text-white focus:outline-none">
              Categories
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute left-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg z-50 transition-all duration-300 transform ${
                isDropdownOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <ul className="py-2">
                {categories.map((category) => (
                  <li
                    key={category}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a href="#" className="text-gray-300 hover:text-white">About</a>
          <a href="#" className="text-gray-300 hover:text-white">Contact</a>
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
