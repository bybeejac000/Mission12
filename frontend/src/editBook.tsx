import { useState } from 'react';
import { book } from './types/books';
import { useParams } from 'react-router-dom';

function EditBook() {
  const { id } = useParams<{ id: string }>(); // Gets the 'id' from the URL

  const [editedBook, setEditedBook] = useState<book>({
    bookId: Number(id),
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
  });

  console.log(id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditedBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const saveBookChanges = async (book: book) => {
    try {
      const response = await fetch(
        `https://booksmission-backend.azurewebsites.net/api/BookAPI?bookId=${book.bookId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(book), // Convert JS object to JSON
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update book: ${response.statusText}`);
      }

      const updatedBook = await response.json();
      console.log('Book updated successfully:', updatedBook);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  return (
    <div className="edit-book-form">
      <h3>Edit Book</h3>

      <label>Title:</label>
      <input
        type="text"
        name="title"
        value={editedBook.title}
        onChange={handleChange}
      />

      <label>Author:</label>
      <input
        type="text"
        name="author"
        value={editedBook.author}
        onChange={handleChange}
      />

      <label>Publisher:</label>
      <input
        type="text"
        name="publisher"
        value={editedBook.publisher}
        onChange={handleChange}
      />

      <label>ISBN:</label>
      <input
        type="text"
        name="isbn"
        value={editedBook.isbn}
        onChange={handleChange}
      />

      <label>Category:</label>
      <input
        type="text"
        name="category"
        value={editedBook.category}
        onChange={handleChange}
      />

      <label>Classification:</label>
      <input
        type="text"
        name="classification"
        value={editedBook.classification}
        onChange={handleChange}
      />

      <label>Page Count:</label>
      <input
        type="number"
        name="pageCount"
        value={editedBook.pageCount}
        onChange={handleChange}
      />

      <label>Price:</label>
      <input
        type="number"
        name="price"
        step="0.01"
        value={editedBook.price}
        onChange={handleChange}
      />

      <button
        onClick={() => saveBookChanges(editedBook)}
        className="btn btn-success"
      >
        Save Changes
      </button>
    </div>
  );
}

export default EditBook;
