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
                  <Categories
                    selectedCategories={selectedCategories}
                    onCheckBoxChange={setSelectedCategories}
                  />
                  <BooksList selectedCategories={selectedCategories} />
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
