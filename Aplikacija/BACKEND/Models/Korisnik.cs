namespace Models;

public class Korisnik
{
    [Key]
    public int ID { get; set; }

    [Required(ErrorMessage ="Morate uneti Ime")]
    public string Ime { get; set; }=null!;

    [Required(ErrorMessage ="Morate uneti Prezime")]
    public string Prezime { get; set; }=null!;
    [Required]
    public string Username { get; set; }=null!;

    [RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$", ErrorMessage = "E-mail is not valid")]
    [MaxLength(320)]
    public string Email { get; set; }=null!;
    public string PasswordHash { get; set; }=null!;
    public string Kontakt { get; set; }=null!;

    public string Pol { get; set; }=null!;
    public string? Role { get; set; }

    [JsonIgnore]
    public List<Recenzija>? Recenzije { get; set; }

    [JsonIgnore]
    public List<Zakazivanje>? Termini { get; set; }

    public List<SpecijalnePonude>? SpecijalnePonude { get; set; }
}