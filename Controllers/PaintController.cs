using Microsoft.AspNetCore.Mvc;

namespace Paint.Controllers
{
    public class PaintController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        /*[HttpPost]
        public IActionResult SaveImage(string imageData)
        {
            // Save imageData to a file or database
            return RedirectToAction("Index");
        }*/
    }
}
