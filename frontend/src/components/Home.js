import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Navbar from "./Navbar";
import ProductList from "./ProductList";
import Footer from './Footer';
import Pagination from './Pagination'; // Import the Pagination component

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // Example: Set this to your total pages or manage it dynamically

  const handlePageChange = (page) => {
    console.log("page", page)
    setCurrentPage(page);
  };

  return (
    <Router>
      <div>
        {/* Navbar is outside of Routes, so it will always be rendered */}
        <Navbar />

        {/* Define routes for different components */}
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <ProductList currentPage={currentPage} />
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
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
