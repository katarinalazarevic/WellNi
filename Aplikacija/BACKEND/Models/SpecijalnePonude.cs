namespace Models;

public class SpecijalnePonude
{
    public int ID { get; set; }
    public string Naziv { get; set; }=null!;
    public string Obavestenje { get; set; }=null!;

    public Korisnik? Administrator { get; set; }
}