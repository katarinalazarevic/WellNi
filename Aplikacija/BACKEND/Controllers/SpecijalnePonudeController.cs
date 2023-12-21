namespace WebTemplate.Controllers;
using Entities;
using Models;
using Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;


[ApiController]
[Route("[controller]")]
public class SpecijalnePonudeController : ControllerBase
{
    public WellniContext Context { get; set; }
    private readonly IConfiguration _configuration; 
    private readonly IEmailService _email;
    
    public SpecijalnePonudeController(WellniContext context,IConfiguration configuration, IEmailService email)
    {
        Context = context;
        _configuration=configuration;
        _email=email;
    }
    
    [Authorize(Roles ="Admin")]
    [HttpPost("OstaviSpecijalnuPonudu")]
    public async Task<IActionResult> OstaviSpecijalnuPonudu([FromBody]DodajSpecijalnuPonudu spec)
    {
        var admin= await Context.Korisnici!.Where(p=>p.Username==spec.Admin).FirstOrDefaultAsync();
        var p=await Context.SpecijalnePonude!.Where(p=>p.Naziv==spec.Naziv).FirstOrDefaultAsync();
        if(p!=null)
        {
            return BadRequest("Vec postoji ponuda sa tim nazivom");
        }
        var ponuda = new SpecijalnePonude();
        ponuda.Naziv=spec.Naziv;
        ponuda.Obavestenje=spec.Obavestenje;
        ponuda.Administrator=admin;
        Context.SpecijalnePonude!.Add(ponuda);
        await Context.SaveChangesAsync();
        return Ok("Dodali ste specijalnu ponudu");
    }

    [Authorize(Roles ="Admin")]
    [HttpPost("VratiSpecijalnePonudeAdmin")]
    public async Task<IActionResult> VratiSpecijalnePonudeAdmin()
    {
        var lista= await Context.SpecijalnePonude!.ToListAsync();
        if(lista==null)
        {
            return BadRequest("Nema specijalnih ponuda");
        }
        return Ok(lista);
    }
    [Authorize(Roles ="Admin")]
    [HttpDelete("ObrisiPonudu/{naziv}")]
    public async Task<IActionResult> ObrisiPonudu(string naziv)
    {
        var lista= await Context.SpecijalnePonude!.Where(p=>p.Naziv==naziv).FirstOrDefaultAsync();
        if(lista==null)
        {
            return BadRequest("Nema specijalnih ponuda");
        }
        Context.SpecijalnePonude!.Remove(lista);
        await Context.SaveChangesAsync();
        return Ok("Uspesno ste obrisali");
    }

    [Authorize(Roles ="User")]
    [HttpGet("VratiSpecijalnePonude")]
    public async Task<IActionResult> VratiSpecijalnePonude()
    {
        var lista= await Context.SpecijalnePonude!.ToListAsync();
        if(lista==null)
        {
            return BadRequest("Nema specijalnih ponuda");
        }
        return Ok(lista);
    }
}