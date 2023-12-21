namespace Models;

using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using WebTemplate.Controllers;

public class WellniContext : DbContext
{

    public DbSet<Korisnik>? Korisnici { get; set; }

    public DbSet<Recenzija>? Recenzije { get; set; }
    public DbSet<Termin>? Termini { get; set; }

    public DbSet<Usluga>? Usluge { get; set; }

    public DbSet<Zaposleni>? Zaposleni { get; set; }
    public DbSet<SpecijalnePonude>? SpecijalnePonude { get; set; }
    public DbSet<Zakazivanje>? Zakazivanje { get; set; }
    public DbSet<ZaposleniUsluga>? ZaposleniUsluga { get; set; }
    public WellniContext(DbContextOptions<WellniContext> options) : base(options)
    {
        
    }

    

    
}
