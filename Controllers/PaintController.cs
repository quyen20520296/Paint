using Microsoft.AspNetCore.Mvc;

namespace Paint.Controllers
{
    public class PaintController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
