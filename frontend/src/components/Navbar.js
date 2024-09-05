import { FiSearch } from "react-icons/fi";

const Navbar = () => {
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
