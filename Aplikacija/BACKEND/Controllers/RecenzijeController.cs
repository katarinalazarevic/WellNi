namespace WebTemplate.Controllers;
using Entities;
using Models;
using Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

[ApiController]
[Route("[controller]")]
public class RecenzijeController : ControllerBase
{
    public WellniContext Context { get; set; }
    
    private readonly IConfiguration _configuration; 
    private readonly IEmailService _email;
    
    public RecenzijeController(WellniContext context,IConfiguration configuration, IEmailService email)
    {
        Context = context;
        _configuration=configuration;
        _email=email;
    }

    [Authorize(Roles ="User")]
    [HttpPost("DodajRecenziju/{usernameK}/{ocena}/{komentar}/{nazivUsluge}")]
    public async Task<IActionResult> DodajRecenziju(string usernameK,int ocena, string komentar, string nazivUsluge)
    {
        try
        {   
            if(ocena<0 || komentar==null)
            {
                BadRequest("Morate uneti i ocenu i komentar");
            }
            var user = await Context.Korisnici!.Where(p=>p.Username==usernameK).FirstOrDefaultAsync();
            if(user==null)
            {
                return BadRequest("Pogresan username");
            }
           
                var usluga= await Context.Usluge!.Where(p=>p.Naziv==nazivUsluge).FirstOrDefaultAsync();
                if(usluga==null)
                {
                    return BadRequest("Ne postoji usluga");
                    
                }   
                var recenzija=new Recenzija();
                recenzija.Datum=DateTime.Now;
                recenzija.Komentar=komentar;
                recenzija.Ocena=ocena;
                recenzija.zaZaposlenog=null;
                recenzija.zaUslugu=usluga;
                Context.Recenzije!.Add(recenzija);
                recenzija.Korisnik=user;
                await Context.SaveChangesAsync();
                return Ok($"Uspesno ste dodali recenziju za uslugu {usluga.Naziv}"); 

        }
        catch(Exception e)
        {
            return BadRequest(e.InnerException?.Message);
        }
    }

    [HttpGet("VratiSveRecenzije")]
    public async Task<IActionResult> VratiSveRecenzije()
    {
        try{
            var recenzije = await Context.Recenzije!.Include(p=>p.zaUslugu).Include(p=>p.zaZaposlenog).Include(p=>p.Korisnik).ToListAsync();
            if(recenzije==null)
            {
                return BadRequest("Nema recenzija");
            }
            return Ok(recenzije.Select(p=>new
            {
                ocena=p.Ocena,
                komentar=p.Komentar,
                datum=p.Datum.Date.ToString("yyyy-MM-dd"),
                korisnik=p.Korisnik.Ime,
                za = p.zaUslugu != null ? p.zaUslugu.Naziv : p.zaZaposlenog!.Ime
                
                
            }));
        }
        catch(Exception e)
        {
            return BadRequest(e.InnerException?.Message);
        }
    }

}