namespace Entities;

public class DodajUsluga
{
    public string Naziv { get; set; }=null!;

    public int Cena { get; set; }

    public string Tip { get; set; }=null!;
    public int MaxKapacitet { get; set; }

    public int DuzinaTrajanja { get; set; }
}