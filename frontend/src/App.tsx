import BooksList from './Booktable';
import Categories from './Categories';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Cart from './Cart';
import { CartProvider } from './context/CartContext';

function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="container">
                    <div className="row justify-content-end">
                      <div className="col-md-12 col-sm-12">
                        <Categories
                          selectedCategories={selectedCategories}
                          onCheckBoxChange={setSelectedCategories}
                        />
                      </div>
                    </div>
                  </div>
                  <br></br>
                  <br></br>
                  <div className="container">
                    <div className="row">
                      <div className="col-md-12 col-sm-12">
                        <BooksList selectedCategories={selectedCategories} />
                      </div>
                    </div>
                  </div>
                </>
              }
            />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
