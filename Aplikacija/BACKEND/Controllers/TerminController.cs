namespace WebTemplate.Controllers;
using Entities;
using Models;
using Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
[ApiController]
[Route("[controller]")]
public class TerminController : ControllerBase
{
    public WellniContext Context { get; set; }
    
    private readonly IConfiguration _configuration; 
    private readonly IEmailService _email;
    
    public TerminController(WellniContext context,IConfiguration configuration, IEmailService email)
    {
        Context = context;
        _configuration=configuration;
        _email=email;
    }

    [Authorize(Roles ="Admin")]
    [HttpPost("DodajTermin")]
    public async Task<IActionResult> DodajTermin([FromBody] DodajTermin termin)
    {
        try
        {
            if(termin.Dan==null || termin.Sati==null || termin.nazivUsluge==null || termin.zaposleni==null)
            {
                return BadRequest("Morate da unesete sve parametre");
            }
            var zap= await Context.Zaposleni!.Where(p=>p.Username==termin.zaposleni).FirstOrDefaultAsync();
            var usluga= await Context.Usluge!.Where(p=>p.Naziv==termin.nazivUsluge).FirstOrDefaultAsync();
            if(zap==null || usluga==null)
            {
                return BadRequest("Ne postoji zaposleni ili usluga");
            }
            var check= await Context.ZaposleniUsluga!.Where(p=>p.Zaposleni.ID==zap.ID && p.Usluga.ID==usluga.ID).FirstOrDefaultAsync();
            var provera= await Context.Termini!.Where(p=>p.Zaposleni!.ID==zap.ID && p.Dan==termin.Dan && p.Sati==termin.Sati && p.Usluga!.ID==usluga.ID).FirstOrDefaultAsync();
            if(provera!=null)
            {
                return BadRequest($"Vec postoji ovaj termin u bazi za {usluga.Naziv}");
            }
            if(check!=null)
            {
                var noviTermin= new Termin();
                noviTermin.Dan=termin.Dan;
                noviTermin.Sati=termin.Sati;
                noviTermin.Usluga=usluga;
                noviTermin.Zaposleni=zap;
                Context.Termini!.Add(noviTermin);
                await Context.SaveChangesAsync();

                return Ok($"Uspesno ste napravili novi termin {noviTermin.Zaposleni.Ime}{noviTermin.Usluga.Naziv} {noviTermin.Dan} {noviTermin.Sati} ");
            }
            else return BadRequest("Zaposleni ne drzi trazenu uslugu");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize(Roles ="Admin")]
    [HttpGet("VratiTermineIUsluge")]
    public async Task<IActionResult> VratiTermineIUsluge()
    {
        try{
            var sve = await Context.Termini!.Include(p=>p.Usluga).Include(p=>p.Zaposleni).Include(p=>p.Korisnici).OrderBy(p => p.Usluga!.Naziv).ToListAsync();
            if(sve!=null)
            {
                return Ok(sve.Select(p=> new{
                    dan=p.Dan,
                    sati=p.Sati,
                    usluga=p.Usluga!.Naziv,
                    zaposleni=p.Zaposleni!.Ime
                }));
            }
            return BadRequest("Ne postoje termini");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    
    
}