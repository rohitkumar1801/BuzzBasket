import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import ProductList from "./ProductList";
import Footer from "./Footer";
import Pagination from "./Pagination"; // Import the Pagination component
import { useDispatch, useSelector } from "react-redux";
import { ITEMS_PER_PAGE } from "../store/constant";
import ProductDetailPage from "./ProductDetailPage";
import Login from "./Auth/Login";
import Signup from "./Auth/SignUp";
import { getUserByToken } from "../slice/userSlice";
import Cart from "./Cart";
import { fetchCartByUserThunk } from "../slice/cartSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const {totalItems} = useSelector((store) => store.product);
 
  useEffect(()=>{
    dispatch(getUserByToken());
    dispatch(fetchCartByUserThunk());
  },[dispatch])

  const handlePageChange = (page) => {
    console.log("page", page);
    setCurrentPage(page);
  };

  return (
    <Router>
      <div>
        {/* Navbar is outside of Routes, so it will always be rendered */}
        <Navbar/>

        {/* Define routes for different components */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ProductList
                  currentPage={currentPage}
            
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalItems/(ITEMS_PER_PAGE))}
                  onPageChange={handlePageChange}
                  
                />
              </>
            }
          />
          <Route
            path="/product-detail/:id"
            element={
              <>
                <ProductDetailPage/>
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Login/>
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Signup/>
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <Cart/>
              </>
            }
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default Home;
