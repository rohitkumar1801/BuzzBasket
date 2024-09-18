/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, ShoppingCart, Menu, ChevronDown } from "lucide-react";
import { fetchCategories } from "../slice/categorySlice";
import { authLogout } from "../slice/userSlice";

const Navbar = () => {
  const { categories } = useSelector((store) => store.category);
  const { loggedInUser } = useSelector((store) => store.user);
  const { cartItems } = useSelector((store) => store.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartItemCount = cartItems?.items?.length || 0;

  const handleCategory = (slug) => {
    setSearchParams({ category: slug });
    navigate(`/?category=${slug}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleMenuClick = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(authLogout());
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [loggedInUser]);

  return (
    <header className="bg-gradient-to-r from-gray-900 via-indigo-600 to-indigo-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              className="h-10 w-auto"
              src="/logo-no-background.png"
              alt="Logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="nav-link hover:text-blue-200 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="nav-link hover:text-blue-200 transition-colors duration-200"
            >
              Products
            </Link>
            <div className="relative group">
              <button className="nav-link flex items-center hover:text-blue-200 transition-colors duration-200">
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-96 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-4 px-6 grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {categories?.map((category) => (
                    <button
                      key={category.id}
                      className="text-left py-2 px-3 text-sm text-gray-700 hover:bg-indigo-100 rounded-md transition-colors duration-200"
                      onClick={() => handleCategory(category.slug)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-indigo-500 bg-opacity-50 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-5 w-5 text-indigo-200" />
              </button>
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="text-white hover:text-blue-200 transition-colors duration-200"
            >
              <ShoppingCart className="h-8 w-8" />
              {cartItemCount > 0 && (
                <span className="absolute top-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {loggedInUser ? (
              <div className="relative">
                <button
                  className="w-11 h-11 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors duration-200"
                  onClick={handleMenuClick}
                >
                  {loggedInUser?.name?.charAt(0).toUpperCase()}
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 transition-colors duration-200"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 transition-colors duration-200"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 transition-colors duration-200"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="nav-link bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-500 transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="nav-link hover:text-blue-200 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="nav-link hover:text-blue-200 transition-colors duration-200"
              >
                Products
              </Link>
              <button
                className="nav-link text-left hover:text-blue-200 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </button>
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-full bg-indigo-500 bg-opacity-50 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button type="submit" className="ml-2">
                  <Search className="h-5 w-5 text-indigo-200" />
                </button>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
