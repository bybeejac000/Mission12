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
