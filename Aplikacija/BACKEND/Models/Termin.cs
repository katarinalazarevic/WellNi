namespace Models;

public class Termin
{

    [Key]
    public int ID { get; set; }
    public string Dan { get; set; }=null!;
    public string Sati { get; set; }=null!;
    public Zaposleni? Zaposleni { get; set; }
    public Usluga?  Usluga { get; set; }
    
    [JsonIgnore]
    public List<Zakazivanje>? Korisnici { get; set; }
    
}