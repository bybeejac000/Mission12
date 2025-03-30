using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission_11.Models;

namespace Mission_11.Controllers
{
    // Define the route for the BookAPI controller
    [Route("api/[controller]")]
    [ApiController]
    public class BookAPI : ControllerBase
    {
        // Declare a private variable for the BookstoreContext
        public BookstoreContext _context;

        // Constructor that initializes the context
        public BookAPI(BookstoreContext temp)
        {
            _context = temp;
        }

        // Define a GET method for fetching categories
        [HttpGet("categories", Name = "Categories")]
        public IActionResult GetCategories()
        {
            // Retrieve distinct categories from the Books table
            var cats = _context.Books
                   .Select(b => b.Category) // Select the category property
                   .Distinct() // Ensure only unique categories are returned
                   .ToList();

            // Return the categories as a JSON response
            return Ok(new
            {
                categories = cats
            });
        }


        [HttpPost(Name ="Add")]
        public ActionResult<Book> AddBook([FromBody] Book book)
        {
            if (book == null)
            {
                return NotFound();
            }
            int id = _context.Books.Max((b) => b.BookId);
            book.BookId = id+1;
            _context.Add(book);
            _context.SaveChanges();

            return Ok(book);
        }



        [HttpPut(Name = "Edit")]
        public IActionResult Edit(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _context.Books.Find(bookId);

            if (existingBook == null)
            {
                return NotFound(new { message = "Book not found." });
            }

            // Update the book properties
            existingBook.Author = updatedBook.Author;
            existingBook.Category = updatedBook.Category;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Isbn = updatedBook.Isbn;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.Title = updatedBook.Title;

            // Save changes to the database
            _context.SaveChanges();

            return Ok(existingBook);
        }

        [HttpDelete(Name = "Delete")]
        public IActionResult Delete(int id)
        {
            var book = _context.Books.Find(id);

            if (book == null)
            {
                return NotFound(); // Return 404 if the book is not found
            }

            _context.Books.Remove(book);
            _context.SaveChanges(); // Save changes to apply the deletion

            return NoContent(); // Return 204 No Content status after deletion
        }




        // Define GET method to fetch books with pagination and sorting options
        [HttpGet(Name = "GetBooks")]
        public IActionResult GetBooks(int pageHowMany, int pageSize, int sort, [FromQuery] List<string>? category)
        {
            // Start with a query on all books
            var query = _context.Books.AsQueryable();

            // Filter books by selected categories if provided
            if (category != null && category.Any())
            {
                query = query.Where(p => category.Contains(p.Category));
            }

            // Get the total number of books matching the query
            var totalNum = query.Count();

            // Get the data based on pagination settings (skip and take)
            List<Book> results = query
                .Skip((pageSize - 1) * pageHowMany) // Skip the appropriate number of books for pagination
                .Take(pageHowMany) // Limit the number of books returned
                .ToList();

            // Sort the results by title if sorting is requested (sort == 1)
            if (sort == 1)
            {
                results = results.OrderBy((p) => p.Title).ToList();
            }

            // Return the results and the total number of books in the response
            return Ok(new
            {
                Res = results,
                TotalRes = totalNum
            });
        }
    }
}
