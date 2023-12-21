namespace WebTemplate.Controllers;

[ApiController]
[Route("[controller]")]
public class WellniController : ControllerBase
{
    public WellniContext Context { get; set; }

    public WellniController(WellniContext context)
    {
        Context = context;
    }
}
