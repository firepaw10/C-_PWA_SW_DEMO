using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Data.DBContexts.DBConnection;

namespace WebApplication1.Controllers;

public class HomeController : Controller
{
    private readonly DBConn _dbConn;
    [HttpGet]
    public IActionResult mailingList()
    {
        return View();
    }

    [HttpPost]
    public IActionResult mailingList(MyFormModel model)
    {
        if (ModelState.IsValid)
        {
            // Process the form data
            String test = _dbConn.Insert_Email(model.Name, model.Email);
            Console.Write(test);
            return RedirectToAction("Success"); // need to define Success.cshtml
        }
        return View(model);
    }

    public IActionResult Success() 
    {
        return View();
    }
    private readonly ILogger<HomeController> _logger;
    
    public HomeController(DBConn dbConn, ILogger<HomeController> logger)
    {
        _dbConn = dbConn;
        _logger = logger;
    }

    public IActionResult Index()
    {
         _dbConn.Main();
        return View();
    }

    public IActionResult Privacy()
    {
        ViewBag.Message = "Don't worry if you lose internet connectivity, this web app is designed to handle that and sync once an internet connection is re-established to push any outgoing requests then and only then.";
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
