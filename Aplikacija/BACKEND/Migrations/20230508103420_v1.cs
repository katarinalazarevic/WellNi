using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebTemplate.Migrations
{
    /// <inheritdoc />
    public partial class v1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Korisnici",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(320)", maxLength: 320, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kontakt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pol = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnici", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Usluge",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Cena = table.Column<int>(type: "int", nullable: false),
                    Tip = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaxKapacitet = table.Column<int>(type: "int", nullable: false),
                    DuzinaTrajanja = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usluge", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Zaposleni",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Zanimanje = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(320)", maxLength: 320, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Zaposleni", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "SpecijalnePonude",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Obavestenje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AdministratorID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecijalnePonude", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecijalnePonude_Korisnici_AdministratorID",
                        column: x => x.AdministratorID,
                        principalTable: "Korisnici",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Recenzije",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ocena = table.Column<int>(type: "int", nullable: false),
                    Komentar = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Datum = table.Column<DateTime>(type: "datetime2", nullable: false),
                    KorisnikID = table.Column<int>(type: "int", nullable: false),
                    zaZaposlenogID = table.Column<int>(type: "int", nullable: true),
                    zaUsluguID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recenzije", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Recenzije_Korisnici_KorisnikID",
                        column: x => x.KorisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Recenzije_Usluge_zaUsluguID",
                        column: x => x.zaUsluguID,
                        principalTable: "Usluge",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Recenzije_Zaposleni_zaZaposlenogID",
                        column: x => x.zaZaposlenogID,
                        principalTable: "Zaposleni",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Termini",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Dan = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sati = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ZaposleniID = table.Column<int>(type: "int", nullable: true),
                    UslugaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Termini", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Termini_Usluge_UslugaID",
                        column: x => x.UslugaID,
                        principalTable: "Usluge",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Termini_Zaposleni_ZaposleniID",
                        column: x => x.ZaposleniID,
                        principalTable: "Zaposleni",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "ZaposleniUsluga",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ZaposleniID = table.Column<int>(type: "int", nullable: false),
                    UslugaID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZaposleniUsluga", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ZaposleniUsluga_Usluge_UslugaID",
                        column: x => x.UslugaID,
                        principalTable: "Usluge",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ZaposleniUsluga_Zaposleni_ZaposleniID",
                        column: x => x.ZaposleniID,
                        principalTable: "Zaposleni",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Zakazivanje",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KorisnikID = table.Column<int>(type: "int", nullable: false),
                    TerminID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Zakazivanje", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Zakazivanje_Korisnici_KorisnikID",
                        column: x => x.KorisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Zakazivanje_Termini_TerminID",
                        column: x => x.TerminID,
                        principalTable: "Termini",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Recenzije_KorisnikID",
                table: "Recenzije",
                column: "KorisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_Recenzije_zaUsluguID",
                table: "Recenzije",
                column: "zaUsluguID");

            migrationBuilder.CreateIndex(
                name: "IX_Recenzije_zaZaposlenogID",
                table: "Recenzije",
                column: "zaZaposlenogID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecijalnePonude_AdministratorID",
                table: "SpecijalnePonude",
                column: "AdministratorID");

            migrationBuilder.CreateIndex(
                name: "IX_Termini_UslugaID",
                table: "Termini",
                column: "UslugaID");

            migrationBuilder.CreateIndex(
                name: "IX_Termini_ZaposleniID",
                table: "Termini",
                column: "ZaposleniID");

            migrationBuilder.CreateIndex(
                name: "IX_Zakazivanje_KorisnikID",
                table: "Zakazivanje",
                column: "KorisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_Zakazivanje_TerminID",
                table: "Zakazivanje",
                column: "TerminID");

            migrationBuilder.CreateIndex(
                name: "IX_ZaposleniUsluga_UslugaID",
                table: "ZaposleniUsluga",
                column: "UslugaID");

            migrationBuilder.CreateIndex(
                name: "IX_ZaposleniUsluga_ZaposleniID",
                table: "ZaposleniUsluga",
                column: "ZaposleniID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Recenzije");

            migrationBuilder.DropTable(
                name: "SpecijalnePonude");

            migrationBuilder.DropTable(
                name: "Zakazivanje");

            migrationBuilder.DropTable(
                name: "ZaposleniUsluga");

            migrationBuilder.DropTable(
                name: "Korisnici");

            migrationBuilder.DropTable(
                name: "Termini");

            migrationBuilder.DropTable(
                name: "Usluge");

            migrationBuilder.DropTable(
                name: "Zaposleni");
        }
    }
}
