import BooksList from './Booktable'; // Import BooksList component
import Categories from './Categories'; // Import Categories component
import './App.css'; // Import custom styles
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router components for navigation

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS for styling
import { useState } from 'react'; // Import useState hook from React
import Cart from './Cart'; // Import Cart component
import { CartProvider } from './context/CartContext'; // Import CartProvider for managing cart state

function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // State to manage selected categories

  return (
    <>
      {/* CartProvider wraps the entire app to provide cart context to all components */}
      <CartProvider>
        {/* Router for handling navigation */}
        <Router>
          {/* Define routes for the app */}
          <Routes>
            {/* Home route for displaying books and categories */}
            <Route
              path="/"
              element={
                <>
                  {/* Container for Categories component */}
                  <div className="container">
                    <div className="row justify-content-end">
                      <div className="col-md-12 col-sm-12">
                        {/* Categories component with state management for category selection */}
                        <Categories
                          selectedCategories={selectedCategories} // Pass selected categories
                          onCheckBoxChange={setSelectedCategories} // Update selected categories on checkbox change
                        />
                      </div>
                    </div>
                  </div>
                  <br></br>
                  <br></br>
                  {/* Container for BooksList component */}
                  <div className="container">
                    <div className="row">
                      <div className="col-md-12 col-sm-12">
                        {/* BooksList component with selected categories passed as props */}
                        <BooksList selectedCategories={selectedCategories} />
                      </div>
                    </div>
                  </div>
                </>
              }
            />
            {/* Route for displaying the Cart component */}
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
