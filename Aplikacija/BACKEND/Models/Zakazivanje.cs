namespace Models;

public class Zakazivanje
{
    public int ID { get; set; }
    public DateTime Datum{get;set;}
    public Korisnik Korisnik { get; set; }=null!;
    public Termin Termin { get; set; }=null!;
}