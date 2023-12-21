namespace Models;

public class ZaposleniUsluga
{
    public int ID { get; set; }
    public Zaposleni Zaposleni { get; set; }=null!;
    public Usluga Usluga { get; set; }=null!;
}