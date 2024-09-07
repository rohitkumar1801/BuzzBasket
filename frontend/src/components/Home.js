import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import ProductList from "./ProductList";
import Footer from "./Footer";
import Pagination from "./Pagination"; // Import the Pagination component
import { useSelector } from "react-redux";

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const {totalItems} = useSelector((store) => store.product);
 

  const handlePageChange = (page) => {
    console.log("page", page);
    setCurrentPage(page);
  };

  return (
    <Router>
      <div>
        {/* Navbar is outside of Routes, so it will always be rendered */}
        <Navbar setSelectedCategory={setSelectedCategory}/>

        {/* Define routes for different components */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ProductList
                  currentPage={currentPage}
                  selectedCategory={selectedCategory}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalItems/16)}
                  onPageChange={handlePageChange}
                  
                />
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
