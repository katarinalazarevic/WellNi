namespace Models;

public class Zaposleni
{
    [Key]
    public int ID { get; set; }
    [Required]
    [MaxLength(50)]
    public string Ime { get; set; }=null!;
    [Required]
    [MaxLength(50)]
    public string Prezime { get; set; }=null!;
    [MaxLength(255)]
    public string Zanimanje { get; set; }=null!;
    [Required]
    public string Username { get; set; }=null!;
    public string Role { get; set; }=null!;

    [Required]
    [RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$", ErrorMessage = "E-mail is not valid")]
    [MaxLength(320)]
    public string Email { get; set; }=null!;
    public string PasswordHash { get; set; }=null!;
    [JsonIgnore]
    public List<Recenzija>? Recenzije { get; set; }
    [JsonIgnore]
    public List<Termin>? Termini { get; set; }
    [JsonIgnore]
    public List<ZaposleniUsluga>? Usluge { get; set; }


}