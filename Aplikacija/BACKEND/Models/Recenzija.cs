namespace Models;

public class Recenzija
{    
    [Key]

    public int ID { get; set; }
    [Range(1,5)]
    public int Ocena { get; set; }

    [Required]
    [MaxLength(255)]
    public string? Komentar { get; set; }
    public DateTime Datum { get; set; }
    public Korisnik Korisnik { get; set; }=null!;

    public Zaposleni? zaZaposlenog { get; set; }

    public Usluga? zaUslugu { get; set; }
    
}