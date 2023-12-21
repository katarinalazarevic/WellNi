namespace WebTemplate.Controllers;
using Entities;
using Models;
using Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;

[ApiController]
[Route("[controller]")]
public class ZakazivanjeController : ControllerBase
{
    public WellniContext Context { get; set; }
    private readonly IConfiguration _configuration; 
    private readonly IEmailService _email;
    
    public ZakazivanjeController(WellniContext context,IConfiguration configuration, IEmailService email)
    {
        Context = context;
        _configuration=configuration;
        _email=email;
    }

    [Authorize(Roles ="User")]
    [HttpPost("ZakaziTermin/{datum}/{sat}/{nazivUsluge}/{imeZaposlenog}/{usernameKorisnika}")]
    public async Task<IActionResult> ZakaziTermin(string usernameKorisnika,string datum, string sat, string nazivUsluge,string imeZaposlenog)
    {
        try{

            if(datum==null || sat==null || nazivUsluge==null || imeZaposlenog==null  || usernameKorisnika==null)
                {
                    return BadRequest("Morate da unesete sve parametre");
                }
            var user= await Context.Korisnici!.Where(p=>p.Username==usernameKorisnika).FirstOrDefaultAsync();
            if(user==null)
            {
                return BadRequest("Nepostojeci user");
            }
            var usluga= await Context.Usluge!.Where(p=>p.Naziv==nazivUsluge).FirstOrDefaultAsync();
            if(usluga==null)
            {
                return BadRequest("Nepostojeca usluga");
            }
            var zaposleni= await Context.Zaposleni!.Where(p=>p.Ime==imeZaposlenog ).FirstOrDefaultAsync();
            if(zaposleni==null)
            {
                return BadRequest("Nepostojeci zaposleni");
            }
            string dateString = datum;
            DateTime date = DateTime.Parse(dateString);
            string dan = date.ToString("dddd",new CultureInfo("sr-Latn-RS"));
            dan = dan.Substring(0, 1).ToUpper() + dan.Substring(1);
            var termin = await Context.Termini!.Include(p=>p.Zaposleni)
                                    .Include(p=>p.Usluga)
                                    .Include(p=>p.Korisnici)
                                    .Where(p=>p.Dan==dan && p.Sati==sat && p.Usluga!.ID==usluga.ID &&p.Zaposleni!.ID==zaposleni.ID).FirstOrDefaultAsync();
            if(termin==null)
            {
                return BadRequest("Ne postoji termin");
            }
                                        
            var broj=termin.Korisnici?.Count ?? 0;
            
            DateTime dat = DateTime.Parse(datum);
            TimeSpan vreme = TimeSpan.Parse(sat);
            if(broj<termin.Usluga!.MaxKapacitet)
            {
                var sched= new Zakazivanje();
                sched.Korisnik=user;
                sched.Termin=termin;
                sched.Datum=dat.Date + vreme;
               Context.Zakazivanje!.Add(sched);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno ste zakazali termin za {nazivUsluge} {datum} {sat}"); //metod avraca uspesno ste zakazali
            }
            else return BadRequest("Popunjen je termin");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize(Roles ="Admin")]
    [HttpGet("VratiZakazivanja")]
    public async Task<IActionResult>  VratiZakazivanja()
    {
        try{
                var zakazivanja = await Context.Zakazivanje!.Include(p=>p.Korisnik).Include(p=>p.Termin.Zaposleni).Include(p=>p.Termin)
                                .ThenInclude(p=>p.Usluga)
                                .ToListAsync();
                if(zakazivanja==null)
                {
                    return BadRequest("Nema zakazivanja");
                }
                return Ok(zakazivanja.Select(p=>new{
                    KorisnikIme = p.Korisnik.Ime,
                    KorisnikPrezime = p.Korisnik.Prezime,
                    Datum = p.Datum.Date.ToString("yyyy-MM-dd"),
                    Dan = p.Termin.Dan,
                    Sati = p.Termin.Sati,
                    ZaposleniUsername = p.Termin.Zaposleni?.Username,
                    NazivUsluge=p.Termin.Usluga!.Naziv
                }));
        
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}