import { book } from './types/books'; // Ensure this path is correct based on your file structure
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { cart } from './types/cart';

function BooksList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books_data, setBooks] = useState<book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sort, setSort] = useState<number>(1);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { cart } = useCart(); // Access the cart from context

  // Fetch book data from API
  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `category=${encodeURIComponent(cat)}`)
        .join('&');
      const response = await fetch(
        `https://localhost:7143/api/BookAPI?pageHowMany=${pageSize}&pageSize=${pageNum}&sort=${sort}${selectedCategories.length ? `&${categoryParams}` : ''}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      setBooks(data.res);
      setTotalItems(data.totalRes);
      setTotalPages(Math.ceil(data.totalRes / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, sort, selectedCategories]);

  return (
    <>
      <h1>
        Cart total: $
        {Math.round(cart.reduce((total, c) => total + c.price, 0) * 100) / 100}
      </h1>

      <h1 className="text-center my-4">Books</h1>
      <button onClick={() => navigate('/cart')}>View Cart</button>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
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
                <button
                  onClick={() => {
                    const newCartItem = {
                      bookId: element.bookId,
                      title: element.title,
                      price: element.price,
                      origPrice: element.price,
                    } as cart;
                    addToCart(newCartItem);
                    console.log('Updated Cart:', cart);
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

      {/* Pagination */}
      {[...Array(totalPages)].map((_, index) => (
        <button key={index + 1} onClick={() => setPageNum(index + 1)}>
          {index + 1}
        </button>
      ))}
      <br></br>
      {/* Sorting */}
      <select value={sort} onChange={(s) => setSort(Number(s.target.value))}>
        <option value="1">Sorted</option>
        <option value="0">Unsorted</option>
      </select>
      <br></br>
      {/* Page Size Selector */}
      <label htmlFor="pages">Results per page </label>
      <select
        value={pageSize}
        onChange={(p) => setPageSize(Number(p.target.value))}
        id="pages"
      >
        <option value="5">5</option>
        <option value="10">10</option>
      </select>

      <p>Page Number {pageNum}</p>
    </>
  );
}

export default BooksList;
