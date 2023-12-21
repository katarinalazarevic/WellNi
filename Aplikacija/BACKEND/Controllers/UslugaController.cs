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
public class UslugaController : ControllerBase
{
    public WellniContext Context { get; set; }
    
    private readonly IConfiguration _configuration; 
    private readonly IEmailService _email;
    
    public UslugaController(WellniContext context,IConfiguration configuration, IEmailService email)
    {
        Context = context;
        _configuration=configuration;
        _email=email;
    }
    private int GetDayOfWeekIndex(string day)
    {
        var cultureInfo = new CultureInfo("sr-Latn-RS");
        var daniuNedelji = cultureInfo.DateTimeFormat.DayNames;
        var dayIndex = Array.IndexOf(daniuNedelji, day);
        return dayIndex != -1 ? dayIndex : -1;
    }


    [Authorize(Roles ="Admin")]
    [HttpPost("DodajUslugu")]

    public async Task<IActionResult> DodajUslugu([FromBody] DodajUsluga usluga)
    {
        try{
            if(string.IsNullOrEmpty(usluga.Naziv))
            {
                return BadRequest("Morate uneti naziv");
            }
            if(usluga.Cena<=0)
            {
                return BadRequest("Morate uneti validnu cenu");
            }
            if(string.IsNullOrEmpty(usluga.Tip))
            {
                return BadRequest("Morate uneti tip");
            }

            Usluga novaUsluga = new Usluga();
            novaUsluga.Naziv=usluga.Naziv;
            novaUsluga.Cena=usluga.Cena;
            novaUsluga.DuzinaTrajanja=usluga.DuzinaTrajanja;
            novaUsluga.MaxKapacitet=usluga.MaxKapacitet;
            novaUsluga.Tip=usluga.Tip;

            var broj= await Context.Usluge!.Where(p=>p.Naziv==novaUsluga.Naziv).ToListAsync();
            if(broj.Count>1)
            {
                return BadRequest("Ova uslug avec postoji");
            }
            Context.Usluge!.Add(novaUsluga);
            await Context.SaveChangesAsync();
            return Ok("Usluga je dodata");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize(Roles ="Admin")]
    [HttpPost("IzmeniUslugu/{naziv}")]

    public async Task<IActionResult> IzmeniUslugu(string naziv,[FromBody] DodajUsluga usluga)
    {
        try{
            if(string.IsNullOrEmpty(usluga.Naziv))
            {
                return BadRequest("Morate uneti naziv");
            }
            if(usluga.Cena<=0)
            {
                return BadRequest("Morate uneti validnu cenu");
            }
            if(string.IsNullOrEmpty(usluga.Tip))
            {
                return BadRequest("Morate uneti tip");
            }

           var novaUsluga = await Context.Usluge!.Where(p => p.Naziv == naziv).FirstOrDefaultAsync();
        if (novaUsluga == null)
        {
            return NotFound("Usluga nije pronađena");
        }
            novaUsluga.Naziv=usluga.Naziv;
            novaUsluga.Cena=usluga.Cena;
            novaUsluga.DuzinaTrajanja=usluga.DuzinaTrajanja;
            novaUsluga.MaxKapacitet=usluga.MaxKapacitet;
            novaUsluga.Tip=usluga.Tip;

            
            Context.Usluge!.Update(novaUsluga);
            await Context.SaveChangesAsync();
            return Ok("Usluga je dodata");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize(Roles ="Admin")]
    [HttpDelete("ObrisiUslugu/{nazivUsluge}")]

    public async Task<IActionResult> ObrisiUslugu(string nazivUsluge)
{
    try
    {
        var usluga = await Context.Usluge!
            .Include(u => u.Termini) // Uključujemo termine za uslugu
            .FirstOrDefaultAsync(p => p.Naziv == nazivUsluge);

        if (usluga == null)
        {
            return BadRequest("Nepostojeca usluga");
        }

        // Brišemo sve termine koji se odnose na uslugu
        foreach (var termin in usluga.Termini!.ToList())
        {
            Context.Termini!.Remove(termin);
        }

        Context.Usluge!.Remove(usluga);
        await Context.SaveChangesAsync();
        
        return Ok($"Usluga je obrisana: {usluga.Naziv}");
    }
    catch (Exception e)
    {
        return BadRequest(e.InnerException?.Message ?? e.Message);
    }
}

    [Authorize(Roles ="Admin,User")]
    [HttpGet("VratiUsluge")]
    public async Task<IActionResult> VratiUsluge()
    {
        try{
            var usluge= await Context.Usluge!.OrderBy(p=>p.Naziv).ToListAsync();
            return Ok(usluge);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("VratiUslugeZaposlenog/{usernameZaposlenog}")]
    public async Task<IActionResult> VratiUslugeZaposlenog(string usernameZaposlenog)
    {
        try{
            var usluge = await Context.ZaposleniUsluga!.Include(p => p.Zaposleni)
                                                  .Include(p => p.Usluga)
                                                  .Where(p => p.Zaposleni.Username == usernameZaposlenog)
                                                  .ToListAsync();

        var rezultat = usluge.Select(p => new
        {
            naziv = p.Usluga.Naziv
        });

        return Ok(rezultat);
    }
        
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
[AllowAnonymous]
[HttpGet("VratiUslugeTeretana")]
    public async Task<IActionResult> VratiUslugeTeretana()
    {
        try{
            var usluge= await Context.Usluge!.Where(p=>p.Tip=="Teretana").ToListAsync();
            return Ok(usluge);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [AllowAnonymous]
    [HttpGet("VratiUslugeSpa")]
    public async Task<IActionResult> VratiUslugeSpa()
    {
        try{
            var usluge= await Context.Usluge!.Where(p=>p.Tip=="Spa").ToListAsync();
            return Ok(usluge);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }


    [HttpGet("VratiUslugeOpadajuce")]
    public async Task<IActionResult> VratiUslugeOpadajuce()
    {
        try{
            var usluge= await Context.Usluge!.OrderByDescending(p => p.Cena).ToListAsync();
            return Ok(usluge);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("VratiUslugeTeretanaOpadajuce")]
    public async Task<IActionResult> VratiUslugeTeretanaOpadajuce()
    {
        try{
            var usluge= await Context.Usluge!.OrderByDescending(p => p.Cena).Where(p=>p.Tip=="Teretana").ToListAsync();
            return Ok(usluge);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("VratiUslugeSpcaOpadajuce")]
    public async Task<IActionResult> VratiUslugeSpaOpadajuce()
    {
        try{
            var usluge= await Context.Usluge!.OrderByDescending(p => p.Cena).Where(p=>p.Tip=="Spa").ToListAsync();
            return Ok(usluge);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [Authorize(Roles ="User")]
    [HttpPost("TerminUsluge/{usluga}")]
    //vrati termin u kome se izvrsava usluga
    public async Task<IActionResult> TerminUsluge(string usluga)
    {
        try{
            var us=await Context.Usluge!.Where(p=>p.Naziv==usluga).FirstOrDefaultAsync();
            var service=  await Context.Termini!.Include(p=>p.Usluga)
                                        .Where(p=>p.Usluga!.Naziv==usluga).Select(p => new
                                        {
                                            dan = p.Dan,
                                            vreme = p.Sati
                                        })
                                        .Distinct()
                                        .ToListAsync();
            if(us!=null)
            {
                var daniNedelje = new List<string> { "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota", "Nedelja" };

                // Sortiramo termine po redosledu dana u nedelji
                var sortiraniTermini = service.OrderBy(t => daniNedelje.IndexOf(t.dan));

                return Ok(sortiraniTermini);
  
                //return Ok(service);
            }
            else 
            
            return BadRequest("Nije pronadjena usluga");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize(Roles ="Zaposleni")]
    [HttpPost("VratiVremeUsluge/{datum}/{usernameZaposlenog}")]
    public async Task<IActionResult> VratiVremeUsluga(string datum, string usernameZaposlenog)
    {
        try{
            string dateString = datum;
            DateTime date = DateTime.Parse(dateString);
            string dan = date.ToString("dddd",new CultureInfo("sr-Latn-RS"));
            dan = dan.Substring(0, 1).ToUpper() + dan.Substring(1);
            var usl=await Context.Zakazivanje!.Include(p=>p.Termin).ThenInclude(p=>p.Zaposleni)
                                                .Where(p=>p.Termin.Dan==dan && p.Termin.Zaposleni!.Username==usernameZaposlenog).ToListAsync();
            
            var distinctUsl = usl.Select(p => new {
            sat = p.Termin.Sati
            }).Distinct();

            return Ok(distinctUsl);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}