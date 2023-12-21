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
public class KorisnikController : ControllerBase
{
    public WellniContext Context { get; set; }
    private readonly IConfiguration _configuration; 
    private readonly IEmailService _email;
    
    public KorisnikController(WellniContext context,IConfiguration configuration, IEmailService email)
    {
        Context = context;
        _configuration=configuration;
        _email=email;
    }
    
    private string CreateToken(Korisnik noviKorisnik)
    {
        List<Claim> claims= new List<Claim>{
                new Claim(ClaimTypes.NameIdentifier,noviKorisnik.Username),
                new Claim(ClaimTypes.Email,noviKorisnik.Email),
                new Claim(ClaimTypes.Role,noviKorisnik.Role!),
                new Claim(ClaimTypes.Sid,noviKorisnik.ID + "")
            };

            var key= new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("JWT:Secret").Value!
            ));

            var creds= new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

            var token= new JwtSecurityToken(
                issuer:_configuration.GetSection("JWT:ValidIssuer").Value!,
                audience: _configuration.GetSection("JWT:ValidAudience").Value!,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(2),
                notBefore: DateTime.UtcNow,
                signingCredentials: creds
            );

            var jwt= new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
    }

    [Authorize(Roles ="Admin")]
    [HttpPost("RegisterAdmin")]
    public async Task<ActionResult> RegisterAdmin([FromBody] AuthKorisnik korisnik)
    {
        if (string.IsNullOrWhiteSpace(korisnik.Email) || korisnik.Email.Length > 320 )
            {
                return BadRequest( "Email neispravan!" );
            }
        if (string.IsNullOrWhiteSpace(korisnik.Username) || korisnik.Username.Length > 30)
        {
            return BadRequest( "Username neispravan!" );
        }
        if (string.IsNullOrEmpty(korisnik.Password) || korisnik.Password.Length > 30)
        {
            return BadRequest( "Neispravna sifra!" );
        }
        if (korisnik.Password.Length < 6)
        {
            return BadRequest( "Sifra mora da bude duza od 6 karaktera!" );
        }
        if (!korisnik.Password.Any(p => Char.IsUpper(p)))
        {
            return BadRequest( "Sifra mora da sadrzi makar jedno veliko slovo!" );
        }
        if (!korisnik.Password.Any(p => Char.IsDigit(p)))
        {
            return BadRequest( "Sifra mora da sadrzi makar jedan broj!" );
        }
        if (!korisnik.Password.Any(p => !Char.IsLetterOrDigit(p)))
        {
            return BadRequest( "Sifra mora da sadrzi makar jedan specijalni karakter! (*-+_@&%$)" );
        }
        if(korisnik.Kontakt.IsNullOrEmpty())
        {
            return BadRequest("Morate uneti kontakt");
        }
        if(string.IsNullOrEmpty(korisnik.Pol) )
        {
            return BadRequest("Morate uneti pol");
        }

        string passwordHash=BCrypt.Net.BCrypt.HashPassword(korisnik.Password);
        var provera= await Context.Korisnici!.Where(p=>p.Email==korisnik.Email).FirstOrDefaultAsync();
        if(provera!=null)
        {
            return BadRequest("Postoji registracija sa unetim emailom");
        }
         provera= await Context.Korisnici!.Where(p=>p.Username==korisnik.Username).FirstOrDefaultAsync();
        if(provera!=null)
        {
            return BadRequest("Username je zauzet");
        }

        var admin=new Korisnik();
        admin.Username=korisnik.Username;
        admin.PasswordHash=passwordHash;
        admin.Email=korisnik.Email;
        admin.Ime=korisnik.Ime;
        admin.Kontakt=korisnik.Kontakt;
        admin.Prezime=korisnik.Prezime;
        admin.Pol=korisnik.Pol;
        admin.Role="Admin"; 
        

        try{
            var check= await Context.Korisnici!.Where(p=> p.Username.Equals(korisnik.Username)).ToListAsync();
            if(check.Count>1)
                return BadRequest("Username je zauzet");
            check= await Context.Korisnici!.Where(p=>p.Email.Equals(korisnik.Email)).ToListAsync();
            if(check.Count>1)
                return BadRequest("Administrator sa unetim emailom vec postoji");
            
            Context.Korisnici!.Add(admin);
            await Context.SaveChangesAsync(); 

            //kreiramo token
            List<Claim> claims= new List<Claim>{
                new Claim(ClaimTypes.NameIdentifier,admin.Username),
                new Claim(ClaimTypes.Email,admin.Email),
                new Claim(ClaimTypes.Role,admin.Role),
                new Claim(ClaimTypes.Sid,admin.ID + "")
            };

            var key= new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("JWT:Secret").Value!
            ));

            var creds= new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

            var token= new JwtSecurityToken(
                issuer:_configuration.GetSection("JWT:ValidIssuer").Value!,
                audience: _configuration.GetSection("JWT:ValidAudience").Value!,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(2),
                notBefore: DateTime.UtcNow,
                signingCredentials: creds
            );

            var jwt= new JwtSecurityTokenHandler().WriteToken(token);
            return Ok("Registrovan je novi administrator");

        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
        
    }

    [AllowAnonymous]
    [HttpPost("Register")]
    public async Task<ActionResult> Register([FromBody] AuthKorisnik korisnik)
    {
        if (string.IsNullOrWhiteSpace(korisnik.Email) || korisnik.Email.Length > 320 )
            {
                return BadRequest( "Email neispravan!" );
            }
        if (string.IsNullOrWhiteSpace(korisnik.Username) || korisnik.Username.Length > 30)
        {
            return BadRequest( "Username neispravan!" );
        }
        if (string.IsNullOrEmpty(korisnik.Password) || korisnik.Password.Length > 30)
        {
            return BadRequest( "Neispravna sifra!" );
        }
        if (korisnik.Password.Length < 6)
        {
            return BadRequest( "Sifra mora da bude duza od 6 karaktera!" );
        }
        if (!korisnik.Password.Any(p => Char.IsUpper(p)))
        {
            return BadRequest( "Sifra mora da sadrzi makar jedno veliko slovo!" );
        }
        if (!korisnik.Password.Any(p => Char.IsDigit(p)))
        {
            return BadRequest( "Sifra mora da sadrzi makar jedan broj!" );
        }
        if (!korisnik.Password.Any(p => !Char.IsLetterOrDigit(p)))
        {
            return BadRequest( "Sifra mora da sadrzi makar jedan specijalni karakter! (*-+_@&%$)" );
        }
        if(korisnik.Kontakt.IsNullOrEmpty())
        {
            return BadRequest("Morate uneti kontakt");
        }
        if(string.IsNullOrEmpty(korisnik.Pol) )
        {
            return BadRequest("Morate uneti pol");
        }

        var provera= await Context.Korisnici!.Where(p=>p.Email==korisnik.Email).FirstOrDefaultAsync();
        if(provera!=null)
        {
            return BadRequest("Postoji registracija sa unetim emailom");
        }
        provera= await Context.Korisnici!.Where(p=>p.Username==korisnik.Username).FirstOrDefaultAsync();
        if(provera!=null)
        {
            return BadRequest("Username je zauzet");
        }

        string passwordHash=BCrypt.Net.BCrypt.HashPassword(korisnik.Password); 

        Korisnik noviKorisnik=new Korisnik();
        noviKorisnik.Username=korisnik.Username;
        noviKorisnik.PasswordHash=passwordHash;
        noviKorisnik.Email=korisnik.Email;
        noviKorisnik.Ime=korisnik.Ime;
        noviKorisnik.Kontakt=korisnik.Kontakt;
        noviKorisnik.Prezime=korisnik.Prezime;
        noviKorisnik.Pol=korisnik.Pol;
        noviKorisnik.Role="NonUser"; //dok se ne desi conformation
        

        try{
            var check= await Context.Korisnici!.Where(p=> p.Username.Equals(korisnik.Username)).ToListAsync();
            if(check.Count>1)
                return BadRequest("Username je zauzet");
            check= await Context.Korisnici!.Where(p=>p.Email.Equals(korisnik.Email)).ToListAsync();
            if(check.Count>1)
                return BadRequest("Korisnik sa unetim emailom vec postoji");
            
            Context.Korisnici!.Add(noviKorisnik);
            await Context.SaveChangesAsync(); 

            //kreiramo token
            List<Claim> claims= new List<Claim>{
                new Claim(ClaimTypes.NameIdentifier,noviKorisnik.Username),
                new Claim(ClaimTypes.Email,noviKorisnik.Email),
                new Claim(ClaimTypes.Role,noviKorisnik.Role),
                new Claim(ClaimTypes.Sid,noviKorisnik.ID + "")
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
            var message= new Message( new string[] {noviKorisnik.Email}, "Registracija", $"'https://localhost:7193/Korisnik/Conformation/{jwt}");
            _email.SendEmail(message);
            return Ok("Registrovali ste se! Proverite Vas mail radi konformacije naloga!");

        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
        
    }

    [AllowAnonymous]
    [HttpGet]
    public IActionResult TestEmail()
    {
        var message=new Message(new string[]
        {"kattlazarevic@gmail.com"},"Test","Testing..");
        
        _email.SendEmail(message);
        return Ok("Poslato uspesno email");
    }

    [AllowAnonymous]
    [HttpGet("Conformation/{token}")]
    public async Task<ActionResult> Conformation(string token)
    {
        try{
            var tokenHandler= new JwtSecurityTokenHandler();
            var key= Encoding.UTF8.GetBytes( 
                _configuration.GetSection("JWT:Secret").Value!
            );
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateActor=true,
                ValidateLifetime=true,
                ValidateIssuerSigningKey=true,
                ValidateIssuer=true,
                ValidateAudience=true,
                ValidAudience= _configuration.GetSection("JWT:ValidAudience").Value!,
                ValidIssuer= _configuration.GetSection("JWT:ValidIssuer").Value!,
                IssuerSigningKey=new SymmetricSecurityKey(key)
            }, out SecurityToken validatedToken);

            var jwtToken= (JwtSecurityToken) validatedToken;
            int ID= int.Parse(jwtToken.Claims.First(x=>x.Type==ClaimTypes.Sid).Value);

            var k=await Context.Korisnici!.FindAsync(ID);
            if(k==null)
            {
                return BadRequest("Invalid conformation");
            }
            k.Role="User";
            Context.Korisnici!.Update(k);
            await Context.SaveChangesAsync();

           return Ok("Uspesno ste potvrdili registraciju");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("Login")]
    public async Task<IActionResult> Login( LoginKorisnik korisnik)
    {
        try{
            
            if(string.IsNullOrWhiteSpace(korisnik.Username)||korisnik.Username.Length > 320)
                return BadRequest("Nevalidni podaci");
            if(string.IsNullOrWhiteSpace(korisnik.Password))
                return BadRequest("Morate da unesete sifru!");
            
            Korisnik user= new Korisnik();
            var k= await Context.Korisnici!.Where(p=> p.Username.Equals(korisnik.Username)).ToListAsync();
            
            if(k.Count<1)
                return BadRequest("Nevazeci username");

            user=k.First();
            if(user.Role=="NonUser")
                return BadRequest("Potvrdite Vas email!");
            
            var s= BCrypt.Net.BCrypt.Verify(korisnik.Password,user.PasswordHash);

            if(s)
            {

                List<Claim> claims= new List<Claim>{
                    new Claim(ClaimTypes.NameIdentifier,user.Username),
                    new Claim(ClaimTypes.Email,user.Email),
                    new Claim(ClaimTypes.Role,user.Role!),
                    new Claim(ClaimTypes.Sid,user.ID + "")
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
    [HttpPost("PromeniSifru/{email}")]
    public async Task<IActionResult> PromeniSifru(string email)
    {
        try{
            var user=await Context.Korisnici!.Where(p=>p.Email==email).FirstOrDefaultAsync();
            if(user==null)
            {
                return BadRequest("Nepostojeci email!");

            }
            else
            {
                List<Claim> claims= new List<Claim>{
                    new Claim(ClaimTypes.NameIdentifier,user.Username),
                    new Claim(ClaimTypes.Email,user.Email),
                    new Claim(ClaimTypes.Role,user.Role!),
                    new Claim(ClaimTypes.Sid,user.ID + "")
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
                var message= new Message( new string[] {user.Email}, "Promena lozinke", $"'https://localhost:7193/Korisnik/ResetPass/{jwt}");
                _email.SendEmail(message);
                return Ok("Proverite Vas email radi promene lozinke!");
            }

        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [AllowAnonymous]
    [HttpGet("ResetPass/{token}")]
    public async Task<ActionResult> ResetPass(string token)
    {
        try{
            var tokenHandler= new JwtSecurityTokenHandler();
            var key= Encoding.UTF8.GetBytes( 
                _configuration.GetSection("JWT:Secret").Value!
            );
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateActor=true,
                ValidateLifetime=true,
                ValidateIssuerSigningKey=true,
                ValidateIssuer=true,
                ValidateAudience=true,
                ValidAudience= _configuration.GetSection("JWT:ValidAudience").Value!,
                ValidIssuer= _configuration.GetSection("JWT:ValidIssuer").Value!,
                IssuerSigningKey=new SymmetricSecurityKey(key)
            }, out SecurityToken validatedToken);

            var jwtToken= (JwtSecurityToken) validatedToken;
            int ID= int.Parse(jwtToken.Claims.First(x=>x.Type==ClaimTypes.Sid).Value);

            var k=await Context.Korisnici!.FindAsync(ID);
            if(k==null)
            {
                return BadRequest("Invalid conformation");
            }
            var formHtml = $@"
            <form method='post' action='/Korisnik/ResetPassword'>
                <input type='hidden' name='userID' value='{ID}' />
                <label for='newPassword'>Nova sifra:</label>
                <input type='text' name='newPassword' id='newPassword' required />
                <br />
                <input type='submit' value='Promeni sifru' />
            </form>";

            return Content(formHtml, "text/html");
            
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("ResetPassword")]
    public async Task<IActionResult> ResetPassword([FromForm] int userID, [FromForm] string newPassword)
    {
        try
        {
            var user = await Context.Korisnici!.FindAsync(userID);
            if (user == null)
            {
                return BadRequest("Nepostojeći korisnik!");
            }

        
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.PasswordHash = passwordHash;

            Context.Korisnici!.Update(user);
            await Context.SaveChangesAsync();

            return Ok("Šifra je uspešno promenjena!");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }


    [Authorize(Roles ="Admin")] 
    [HttpGet("PrikaziKorisnike")]
    public async Task<IActionResult> VratiKorisnike()
    {
        try{
            var korisnici= await Context.Korisnici!.ToListAsync();
            return Ok(korisnici);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [AllowAnonymous] //takodje ne anonimus, ali ova metoda nam i n etreba
    [HttpGet("ObrisiKorisnika/{id}")]
    public async Task<IActionResult> ObrisiKorisnika(int id)
    {
        var k= await Context.Korisnici!.Where(p=>p.ID.Equals(id)).ToListAsync();
        var korisnik=k.First();
        Context.Korisnici!.Remove(korisnik);
        await Context.SaveChangesAsync();
        return Ok("Uspesno brisanje");

    }

    [Authorize(Roles ="User")] 
    [HttpPost("ProveraBrojaTermina/{username}")]
    public async Task<IActionResult> ProveraBrojaTermina(string username)
    {
        try
        {
            var korisnik= await Context.Korisnici!.Where(p=>p.Username==username).FirstOrDefaultAsync();
            if(korisnik==null)
            {
                return BadRequest("Nepostojeci username");
            }
            //var broj = korisnik.Termini.Count;
            var korisnici= await Context.Korisnici!.Include(p=>p.Termini) //imamo i zakazivanje, proveri sta radis
                                                    .ToListAsync();
                                                    var broj = korisnik.Termini?.Count;
            //var broj= korisnici.Where(p=>p.ID==korisnik.ID).Count();
            
            if(broj==5|| broj==10 || broj==15)
            {
                var message= new Message( new string[] {korisnik.Email}, "Nagrada", 
                $"Postovani {korisnik.Ime}, hvala Vam sto koristite nase usluge! Poklanjamo vam vaucer u vrednosti od 1000 dinara!");
                _email.SendEmail(message);
                return Ok($"{broj}");
            }
            else{
                //return BadRequest($"Korisnik nije ispunio normu za vaucer , do sada ste rezervisali: {broj} termin-a");
                return BadRequest($"{broj}");
            }
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [Authorize(Roles ="User")]
    [HttpGet("VratiMojeTermine/{username}")]
    public async Task<IActionResult> VratiMojeTermine(string username)
    {
        try{
            var korisnik = await Context.Korisnici!.Where(p=>p.Username==username).FirstOrDefaultAsync();
            if(korisnik==null)
            {
                return BadRequest("Nepostojeci korisnik");
            }
            else{
                var termin= await Context.Zakazivanje!.Include(p=>p.Korisnik)
                                                        .Include(p=>p.Termin)
                                                        .ThenInclude(p=>p.Usluga)
                                                        .Where(p=>p.Korisnik.Username==username)
                                                        .ToListAsync();
                if(termin==null)
                {
                    return BadRequest("Nemate zakazane termine");
                }
                return Ok(termin.Select(p=>new{
                    datum=p.Datum.Date.ToString("yyyy-MM-dd"),
                    sat=p.Termin.Sati,
                    naziv=p.Termin.Usluga!.Naziv
                }));
            }

        }
        catch(Exception e){
            return BadRequest(e.Message);
        }
                                        

    }

    
    [Authorize(Roles ="User")]
    //trener zeli da otkaze, svim korisnicima se salje mejl
    [HttpPost("OtkaziZakazanTermin/{usluga}/{datum}/{sat}/{usernameKorisnika}")]
    public async Task<IActionResult> OtkaziZakazanTermin(string usluga, string datum, string sat, string usernameKorisnika)
    {
    try
    {    
           string dateString = datum;
            DateTime date = DateTime.Parse(dateString);
            string dan = date.ToString("dddd",new CultureInfo("sr-Latn-RS"));
            dan = dan.Substring(0, 1).ToUpper() + dan.Substring(1);
            
        
            var termin= await Context.Zakazivanje!.Include(p=>p.Korisnik)
                                                        .Include(p=>p.Termin)
                                                        .ThenInclude(p=>p.Usluga)
                                                        .Where(p=>p.Korisnik.Username==usernameKorisnika && p.Termin.Dan==dan &&p.Termin.Sati==sat && p.Termin.Usluga!.Naziv==usluga)
                                                        .FirstOrDefaultAsync();
        

        if (termin != null)
        {
            Context.Zakazivanje!.Remove(termin);
            await Context.SaveChangesAsync();
            return Ok("Uspesno ste otkazali termin");
        }
        return BadRequest("Nepostojece zakazivanje");
        
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
  
}