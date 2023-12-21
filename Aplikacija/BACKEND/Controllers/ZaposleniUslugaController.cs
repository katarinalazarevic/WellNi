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
public class ZaposleniUslugaController : ControllerBase
{
    public WellniContext Context { get; set; }
    private readonly IConfiguration _configuration; 
    private readonly IEmailService _email;
    
    public ZaposleniUslugaController(WellniContext context,IConfiguration configuration, IEmailService email)
    {
        Context = context;
        _configuration=configuration;
        _email=email;
    }

    [Authorize(Roles ="Admin")] 
    [HttpPost("DodajZaposlenogUsluzi/{usernameZaposlenog}/{nazivUsluge}")]
    //msm da ovde promenis da bude ime usluge, ovo svako izvrsava admin samo
    public async Task<IActionResult> DodajZaposlenogUslugi(string usernameZaposlenog,string nazivUsluge)
    {
        try 
       {     
            var zaposleni= await Context.Zaposleni!.Where(p=>p.Username==usernameZaposlenog).FirstOrDefaultAsync();
            if(zaposleni==null)
            {
                return BadRequest("Nema zaposlenog sa tim nazivom");
            }
            var usluga = await Context.Usluge!.Where(p=>p.Naziv==nazivUsluge).FirstOrDefaultAsync();;
            if(usluga==null)
            {
                return BadRequest("Nema usluga sa tim nazivom");
            }
            if (zaposleni.Zanimanje=="Trener")
            {
                if(usluga.Tip=="Spa")
                {
                    return BadRequest("Ne moze da se doda SPA usluga Treneru");
                }
            }
            else
            {
                if(usluga.Tip=="Teretana")
                {
                    return BadRequest("Ne moze se dodati TERETANA usluga Fizioterapeutu");
                }
            }
            var provera = await Context.ZaposleniUsluga!.Where(p=>p.Zaposleni.ID==zaposleni.ID && p.Usluga.ID==usluga.ID).FirstOrDefaultAsync();
            if(provera!=null)
            {
                return BadRequest($"Vec je dodata usluga {usluga.Naziv} zaposlenom {zaposleni.Ime}");
            }
            var vrsi= new ZaposleniUsluga
                {
                    Usluga=usluga,
                    Zaposleni=zaposleni
                };
            
            await Context.ZaposleniUsluga!.AddAsync(vrsi);
            
            await Context.SaveChangesAsync();
            return Ok($"Dodat usluga {vrsi.Usluga.Naziv} zaposlenom  {vrsi.Zaposleni.Ime}");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    //[Authorize(Roles ="Admin")]    
    //provera da li je upisano u bazu
    [HttpGet("VratiVrsioceIUsluge")]
    public async Task<IActionResult> VratiVrsioce()
    {
        var vrsi= await Context.ZaposleniUsluga!.Include(p=>p.Usluga)
                                                .Include(p=>p.Zaposleni).OrderBy(p => p.Usluga!.Naziv).ToListAsync();
        return Ok(vrsi.Select(p=>new
        {
            ime=p.Zaposleni.Ime,
            prezime=p.Zaposleni.Prezime,
            nazivUsluga= p.Usluga.Naziv
        }));
    }
    [Authorize(Roles ="Admin")]
    [HttpDelete("ObrisiZakazivanje/{usernameZaposlenog}/{nazivUsluge}")]
    public async Task<IActionResult> Obrisi(string usernameZaposlenog,string nazivUsluge)
    {
        var obj = await Context.ZaposleniUsluga!.Include(p=>p.Usluga).Include(p=>p.Zaposleni)
                .Where(p=>p.Usluga.Naziv==nazivUsluge && p.Zaposleni.Username==usernameZaposlenog).FirstOrDefaultAsync();
        if(obj==null)
        {
            return BadRequest("Ne postoji");
        }
         Context.ZaposleniUsluga!.Remove(obj);
         await Context.SaveChangesAsync();
         return Ok("Obrisan posao");

    }
    
    [Authorize(Roles ="Zaposleni")]
    [HttpPost("VratiMojeTermine/{usernameZaposleni}")]
    public async Task<IActionResult> VratiMojeTermine(string usernameZaposleni)
    {
        try{
            var zaposleni= await Context.Zaposleni!.Where(p=>p.Username==usernameZaposleni).FirstOrDefaultAsync();
            if(zaposleni==null)
            {
                return BadRequest("Nepostojeci zaposleni");
            }
            var vrsi= await Context.ZaposleniUsluga!.Include(p=>p.Usluga)
                                                    .ThenInclude(p=>p.Termini)
                                                .Include(p=>p.Zaposleni)
                                                .Where(p=>p.Zaposleni==zaposleni).ToListAsync();
            return Ok(vrsi.Select(p=>new{
                usluga = p.Usluga.Naziv,
                termini = p.Usluga.Termini!.Select(t => new {
                dan = t.Dan,
                sat = t.Sati}).Distinct()
                
            }));
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize(Roles ="User")]
    [HttpPost("VratiVrsiocaUsluge/{datum}/{sat}/{nazivUsluge}")]
    public async Task<IActionResult> VratiVrsiocaUsluge(string datum, string sat,string nazivUsluge)
    {
        try{
            if(datum ==null||sat==null|| nazivUsluge==null)
            {
                return BadRequest("Morate uneti sva polja");
            }
            string dateString = datum;
            DateTime date = DateTime.Parse(dateString);
            string dan = date.ToString("dddd",new CultureInfo("sr-Latn-RS"));
            dan = dan.Substring(0, 1).ToUpper() + dan.Substring(1);
            //return Ok(dan);

            var usluga = await Context.Usluge!.FirstOrDefaultAsync(p => p.Naziv == nazivUsluge); // Provera da li postoji usluga
            var danTermin= await Context.Termini!.Include(p=>p.Usluga).Where(p=>p.Usluga!.Naziv==nazivUsluge).Where(p=>p.Dan==dan).FirstOrDefaultAsync();
            if(danTermin==null)
            {
                return BadRequest("Izabrali ste dan kad se ne vrsi usluga");
            }
        var termini = await Context.Termini!
            .Include(p => p.Usluga)
            .Include(p => p.Zaposleni)
            .Where(p => p.Usluga!.Naziv == nazivUsluge)
            .Where(p => p.Sati == sat)
            .Where(p => p.Dan == dan).ToListAsync();

        

        if (termini.Count == 0)
        {
            // Termin ne postoji za taj dan
            return BadRequest("Termin ne postoji za traženi dan.");
        }
        //postoje vrati zaposlene
         return Ok(termini.Select(p=>new {
             ime=p.Zaposleni!.Ime,
             prezime=p.Zaposleni.Prezime
        }));
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize(Roles ="Zaposleni")]
    [HttpPost("VratiUslugeVrsioca/{datum}/{sat}/{usernameZaposlenog}")]
    public async Task<IActionResult> VratiUslugeVrsioca(string datum, string sat,string usernameZaposlenog)
    {
        try{
            if(datum ==null||sat==null|| usernameZaposlenog==null)
            {
                return BadRequest("Morate uneti sva polja");
            }
            string dateString = datum;
            DateTime date = DateTime.Parse(dateString);
            string dan = date.ToString("dddd",new CultureInfo("sr-Latn-RS"));
            dan = dan.Substring(0, 1).ToUpper() + dan.Substring(1);
            //return Ok(dan);
        var termin= await Context.Termini!.Include(p=>p.Zaposleni).Include(p=>p.Usluga)
                                        .Where(p=>p.Dan==dan && p.Sati==sat && p.Zaposleni!.Username==usernameZaposlenog).FirstOrDefaultAsync();

        if(termin==null)
        {
            return BadRequest("Ne postoji termin");
        }
        var zakazivanje= await Context.Zakazivanje!.Include(p=>p.Termin)
                                            .Where(p=>p.Termin.Usluga!.Naziv==termin.Usluga!.Naziv).ToListAsync();
        if(zakazivanje==null)
        {
            return BadRequest("Nista nije zakazano za odabrani datum i vreme");
        }
        
        return Ok(zakazivanje.Select(p => new {
        naziv = p.Termin?.Usluga?.Naziv
        }).Where(p => p.naziv != null).Distinct());
                
        
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
   
}