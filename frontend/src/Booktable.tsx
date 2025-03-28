import { book } from './types/books'; // Ensure this path is correct based on your file structure
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { cart } from './types/cart';

function BooksList({ selectedCategories }: { selectedCategories: string[] }) {
  // State for managing books data and pagination
  const [books_data, setBooks] = useState<book[]>([]); // Store the list of books
  const [pageSize, setPageSize] = useState<number>(10); // Number of books per page
  const [pageNum, setPageNum] = useState<number>(1); // Current page number
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of books in all pages
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages
  const [sort, setSort] = useState<number>(1); // Sort order for books
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Access the function to add items to the cart
  const { cart } = useCart(); // Access the cart from context

  // Fetch book data from API when pageSize, pageNum, sort, or selectedCategories change
  useEffect(() => {
    const fetchBooks = async () => {
      // Prepare category query parameters if selected
      const categoryParams = selectedCategories
        .map((cat) => `category=${encodeURIComponent(cat)}`)
        .join('&');

      // API call to fetch books based on pagination and sorting
      const response = await fetch(
        `https://localhost:7143/api/BookAPI?pageHowMany=${pageSize}&pageSize=${pageNum}&sort=${sort}${selectedCategories.length ? `&${categoryParams}` : ''}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      setBooks(data.res); // Set the books data
      setTotalItems(data.totalRes); // Set total items for pagination
      setTotalPages(Math.ceil(data.totalRes / pageSize)); // Calculate total pages
    };

    fetchBooks();
  }, [pageSize, pageNum, sort, selectedCategories]); // Re-run effect when dependencies change

  return (
    <>
      {/* Display the total cart value */}
      <h1>
        Cart total: $
        {Math.round(cart.reduce((total, c) => total + c.price, 0) * 100) / 100}
      </h1>

      {/* Display the title of the books list */}
      <h1 className="text-center my-4">Books</h1>

      {/* Button to navigate to the cart page */}
      <button onClick={() => navigate('/cart')}>View Cart</button>

      {/* Table displaying the list of books */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            {/* Table headers */}
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Number of Pages</th>
            <th>Price</th>
            <th>Cart</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop through each book and display its data */}
          {books_data.map((element) => (
            <tr key={element.bookId}>
              <td>{element.title}</td>
              <td>{element.author}</td>
              <td>{element.publisher}</td>
              <td>{element.isbn}</td>
              <td>{element.category}</td>
              <td>{element.pageCount}</td>
              <td>${element.price.toFixed(2)}</td>
              <td>
                {/* Button to add book to the cart */}
                <button
                  onClick={() => {
                    const newCartItem = {
                      bookId: element.bookId,
                      title: element.title,
                      price: element.price,
                      origPrice: element.price,
                    } as cart;
                    addToCart(newCartItem); // Add item to the cart
                    console.log('Updated Cart:', cart); // Log the updated cart
                  }}
                  className="btn btn-primary"
                >
                  Add To Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      {[...Array(totalPages)].map((_, index) => (
        <button key={index + 1} onClick={() => setPageNum(index + 1)}>
          {index + 1}
        </button>
      ))}
      <br></br>

      {/* Sorting control */}
      <select value={sort} onChange={(s) => setSort(Number(s.target.value))}>
        <option value="1">Sorted</option>
        <option value="0">Unsorted</option>
      </select>
      <br></br>

      {/* Page size selector */}
      <label htmlFor="pages">Results per page </label>
      <select
        value={pageSize}
        onChange={(p) => setPageSize(Number(p.target.value))}
        id="pages"
      >
        <option value="5">5</option>
        <option value="10">10</option>
      </select>

      {/* Display current page number */}
      <p>Page Number {pageNum}</p>
    </>
  );
}

export default BooksList;
