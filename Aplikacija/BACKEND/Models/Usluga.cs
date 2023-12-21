namespace Models;

public class Usluga
{
    [Key]
    public int ID { get; set; }

    public string Naziv { get; set; }=null!;

    public int Cena { get; set; }

    public string Tip { get; set; }=null!;
    public int MaxKapacitet { get; set; }

    public int DuzinaTrajanja { get; set; }
    [JsonIgnore]
    public List<Termin>? Termini { get; set; }
    [JsonIgnore]
    public List<ZaposleniUsluga>? Zaposleni { get; set; }
    [JsonIgnore]
    public List<Recenzija>? Recenzije { get; set; }

   
    
}