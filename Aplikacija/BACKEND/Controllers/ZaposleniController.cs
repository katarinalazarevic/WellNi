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

public class ZaposleniController : ControllerBase
{
    public WellniContext Context { get; set; }
    private readonly IConfiguration _configuration; 
    private readonly IEmailService _email;

    public ZaposleniController(WellniContext context,IConfiguration configuration, IEmailService email)
    {
        Context=context;
        _configuration=configuration;
        _email=email;
    }

    [Authorize(Roles ="Admin")]
    [HttpPost("RegisterZaposleni")]
    public async Task<IActionResult> Register([FromBody] RegisterZaposleni zaposleni)
    {
        if(string.IsNullOrWhiteSpace(zaposleni.Email) || zaposleni.Email.Length >320)
        {
            return BadRequest("Nevalidni podaci za email");
        }
        if (string.IsNullOrWhiteSpace(zaposleni.Username) || zaposleni.Username.Length > 50)
        {
            return BadRequest(new { msg = "Username not valid!" });
        }
        if (string.IsNullOrEmpty(zaposleni.Password) || zaposleni.Password.Length > 50)
        {
            return BadRequest(new { msg = "Invalid Password!" });
        }
        if (zaposleni.Password.Length < 6)
        {
            return BadRequest(new { msg = "Sifra mora da bude duza od 6 karaktera!" });
        }
        if (!zaposleni.Password.Any(p => Char.IsUpper(p)))
        {
            return BadRequest(new { msg = "Sifra mora da sadrzi makar jedno veliko slovo!" });
        }
        if (!zaposleni.Password.Any(p => Char.IsDigit(p)))
        {
            return BadRequest(new { msg = "Sifra mora da sadrzi makar jedan broj!" });
        }
        if (!zaposleni.Password.Any(p => !Char.IsLetterOrDigit(p)))
        {
            return BadRequest(new { msg = "Sifra mora da sadrzi makar jedan specijalni karakter! (*-+_@&%$)" });
        }
        if(string.IsNullOrWhiteSpace(zaposleni.Zanimanje)|| zaposleni.Zanimanje.Length>270)
        {
            return BadRequest("Nevalidni podaci za zanimanje");

        }

        var sifraHash= BCrypt.Net.BCrypt.HashPassword(zaposleni.Password);
        Zaposleni noviZ= new Zaposleni();
        noviZ.Email=zaposleni.Email;
        noviZ.Username=zaposleni.Username;
        noviZ.PasswordHash=sifraHash;
        noviZ.Ime=zaposleni.Ime;
        noviZ.Prezime=zaposleni.Prezime;
        noviZ.Zanimanje=zaposleni.Zanimanje;
        noviZ.Role="Zaposleni";
        
        try
        {
            var z= await Context.Zaposleni!.Where(p=>p.Username.Equals(noviZ.Username)).ToListAsync();
            if(z.Count>1)
            {
                return BadRequest("Username je zauzet");
            }
            z=await Context.Zaposleni!.Where(p=>p.Email.Equals(noviZ.Email)).ToListAsync();
            if(z.Count>1)
                return BadRequest("Zaposleni sa unetim emailom vec postoji");
            
            Context.Zaposleni!.Add(noviZ);
            await Context.SaveChangesAsync(); 
            return Ok("Zaposleni je dodat");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("LoginZaposleni")]
    [AllowAnonymous]

    public async Task<IActionResult> Login([FromBody] LoginZaposleni zaposleni)
    {
        try{

            if(string.IsNullOrWhiteSpace(zaposleni.Username)||zaposleni.Username.Length > 320)
                    return BadRequest("Nevalidni podaci");
            if(string.IsNullOrWhiteSpace(zaposleni.Password))
                    return BadRequest("Morate da unesete sifru!");
            var z= await Context.Zaposleni!.Where(p=>p.Username.Equals(zaposleni.Username)).FirstAsync();
            var sifra= BCrypt.Net.BCrypt.Verify(zaposleni.Password,z.PasswordHash);
            if(sifra)
            {   
                List<Claim> claims= new List<Claim>{
                    new Claim(ClaimTypes.NameIdentifier,z.Username),
                    new Claim(ClaimTypes.Email,z.Email),
                    new Claim(ClaimTypes.Role,z.Role!),
                    new Claim(ClaimTypes.Sid,z.ID + "")
                };

                var key= new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    _configuration.GetSection("JWT:Secret").Value!
                ));

                var creds= new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

                var token= new JwtSecurityToken(
                    issuer:_configuration.GetSection("JWT:ValidIssuer").Value!,
                    audience: _configuration.GetSection("JWT:ValidAudience").Value!,
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(15),
                    notBefore: DateTime.UtcNow,
                    signingCredentials: creds
                );

                var jwt= new JwtSecurityTokenHandler().WriteToken(token);
                return Ok( jwt);

            }
            else
            {
                return BadRequest("Pogresna sifra");
            }

        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        } 
        
    }

    [AllowAnonymous]
    [HttpGet("VratiZaposlene")]
  
    public async Task<IActionResult> VratiZaposlene()
    {
        try{
            var treneri= await Context.Zaposleni!.ToListAsync();
            return Ok(treneri);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpGet("VratiTrenereIUsluge")]
    [AllowAnonymous]
    public async Task<IActionResult> VratiTrenereIUsluge()
    {
        try{
            var treneri= await Context.ZaposleniUsluga!.Include(p=>p.Zaposleni)
                                                .Include(p=>p.Usluga).Where(p=>p.Zaposleni.Zanimanje.Equals("Trener")).ToListAsync();
            return Ok(treneri.Select(p=> new
            { 
                ime=p.Zaposleni.Ime,
                prezime=p.Zaposleni.Prezime,
                usluga=p.Usluga.Naziv
            }
            ));
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpGet("VratiFizioterapeuteIUsluge")]
    [AllowAnonymous]
    public async Task<IActionResult> VratiFizioterapeuteIUsluge()
    {
        try{
            var fizio= await Context.ZaposleniUsluga!.Include(p=>p.Zaposleni)
                                                .Include(p=>p.Usluga).Where(p=>p.Zaposleni.Zanimanje.Equals("Fizioterapeut")).ToListAsync();
            return Ok(fizio.Select(p=> new
            { 
                ime=p.Zaposleni.Ime,
                prezime=p.Zaposleni.Prezime,
                usluga=p.Usluga.Naziv
            }
            ));
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("UslugeTrenera/{usluga}")]
    [AllowAnonymous]
    public async Task<IActionResult> UslugeTrenera(string usluga)
    {
        try{
            var treneri= await Context.Zaposleni!.Include(p=>p.Termini!).ThenInclude(p=>p.Usluga).Where(p=>p.Zanimanje.Equals("Trener"))
                                                .Where(p=>p.Usluge!.Equals(usluga)).ToListAsync();
            return Ok(treneri.Select(p=> new
            { 
                ime=p.Ime,
                prezime=p.Prezime,
                usluga=p.Termini
            }
            ));
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpGet("UslugeFizioterapeuta/{usluga}")]
    [AllowAnonymous]
    public async Task<IActionResult> UslugeFizioterapeuta(string usluga)
    {
        try{
            var fizio= await Context.Zaposleni!.Where(p=>p.Zanimanje.Equals("Fizioterapeut"))
                                                .Where(p=>p.Usluge!.Equals(usluga)).ToListAsync();
            return Ok(fizio.Select(p=> new
            { 
                ime=p.Ime,
                prezime=p.Prezime
            }
            ));
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize(Roles ="Zaposleni")]
    //trener zeli da otkaze, svim korisnicima se salje mejl
    [HttpPost("OtkaziTermin/{usluga}/{datum}/{sat}/{usernameZaposlenog}")]
    public async Task<IActionResult> PosaljiMejlKorisnicima(string usluga, string datum, string sat, string usernameZaposlenog)
    {
    try
    {    
           string dateString = datum;
            DateTime date = DateTime.Parse(dateString);
            string dan = date.ToString("dddd",new CultureInfo("sr-Latn-RS"));
            dan = dan.Substring(0, 1).ToUpper() + dan.Substring(1);
            
            // var zakazivanje= await Context.Zakazivanje!.Include(p=>p.Korisnik)
            //                                             .Include(p=>p.Termin)
            //                                             .Where(p=>p.Termin.Dan==dan && p.Termin.Sati==sat && p.Termin.Usluga!.Naziv==usluga && p.Termin.Zaposleni!.Username==usernameZaposlenog)
            //                                             .FirstOrDefaultAsync();
        var termin = await Context.Termini!
            .Include(t => t.Korisnici!)
                .ThenInclude(z => z.Korisnik)
            .FirstOrDefaultAsync(t => t.Dan == dan && t.Sati == sat && t.Usluga!.Naziv == usluga && t.Zaposleni!.Username==usernameZaposlenog);
        

        if (termin != null)
        {
            var zakazivanje = await Context.Zakazivanje!
                .Include(z => z.Termin)
                .Where(z => z.Termin.Dan == dan && z.Termin.Sati == sat && z.Termin.Usluga!.Naziv == usluga && z.Termin.Zaposleni!.Username == usernameZaposlenog)
                .ToListAsync();

            if (zakazivanje.Any())
            {
                foreach (var z in zakazivanje)
                {
                    Context.Zakazivanje!.Remove(z);
                }

                await Context.SaveChangesAsync();

                foreach (var z in zakazivanje)
                {
                    var message = new Message(new string[] { z.Korisnik.Email }, "Otkazivanje termina",
                        $"Poštovani {z.Korisnik.Ime}, obaveštavamo vas da je termin dana {dan} u {sat} sati, {usluga} otkazan.");

                    _email.SendEmail(message);
                }

                return Ok("Mejl je poslat korisnicima, zakazivanja su otkazana.");
            }
        }

        return Ok("Nema zakazanih termina za dati datum i vreme.");
        
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize(Roles ="Admin")] 
    [HttpDelete("ObrisiZaposlenog/{username}")]
    public async Task<IActionResult> ObrisiZaposlenog(string username)
    {
        try{
            var zaposlen=await Context.Zaposleni!.Where(p=>p.Username==username).FirstOrDefaultAsync();
            if(zaposlen==null)
            {
                return BadRequest("Ne postoji zaposlen");
            }
            Context.Zaposleni!.Remove(zaposlen);
         await Context.SaveChangesAsync();
         return Ok("Obrisan zaposlen");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}