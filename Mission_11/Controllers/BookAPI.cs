using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission_11.Models;

namespace Mission_11.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookAPI : ControllerBase
    {

        public BookstoreContext _context;

        public BookAPI(BookstoreContext temp)
        {
            _context = temp;
        }


        [HttpGet("categories",Name = "Categories")]
        public IActionResult GetCategories()
        {
            var cats = _context.Books
                   .Select(b => b.Category) // Select the category property
                   .Distinct() // Ensure only unique categories are returned
                   .ToList();

            return Ok(new
            {
                categories = cats
            });
        }


        //Define get method
        [HttpGet(Name = "GetBooks")]
        public IActionResult GetBooks(int pageHowMany, int pageSize, int sort,[FromQuery] List<string>? category)
        {
            var query = _context.Books.AsQueryable();

            if (category != null && category.Any())
            {
                query = query.Where(p => category.Contains(p.Category));
            }



            //get total num records
            var totalNum = query.Count();

            //get the data
            List<Book> results = query
                .Skip((pageSize - 1) * pageHowMany)
                .Take(pageHowMany)
                .ToList();

            //sort if requested
            if (sort == 1)
            {
                
                results = results.OrderBy((p) => p.Title).ToList();
            }



            //return object

            return Ok(new
            {
                Res = results,
                TotalRes = totalNum
            });


        }



    }
}
