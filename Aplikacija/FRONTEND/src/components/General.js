import React from 'react'
import './General.css'
export default function General() {
  return (
    <div className='container'>
        <div className='container-krug'>
          <div className='krug1'>
           
            <p> <h1>BRIGA O SEBI</h1>Briga o sebi i očuvanje zdravlja je nešto što treba negovati svakodnevno. U današnjem užurbanom svetu se često zapostavljaju lične potrebe, a mi kao tim želimo promovisati važnost ličnog razvoja u svakom pogledu. Verujemo da je briga o sebi ključna za postizanje ravnoteže, smanjenje stresa i unapređenje ukupnog blagostanja. Pored toga, nudimo različite usluge i programe koji su prilagođeni individualnim potrebama i interesovanjima naših korisnika</p>
          </div>
          <div className='krug2'>
            <p><h1>SPECIJALNE PONUDE</h1>
            
            Kada korisnik sakupi 5 zakazanih termina, nagrađujemo ga iznenađujućim pogodnostima. To je naš način da nagradimo i motivišemo klijente za odlučnost da se redovno brinu o svom telu i umu.
        Pridružite se WellNi centru i budite deo naše zajednice koja se posvećuje vašem blagostanju. 
        Neka briga o sebi postane prioritet, a nagrade koje vam nudimo nakon petog zakazanog termina neka budu dodatna motivacija na vašem putu ka zdravlju i sreći.</p>
          </div>
        </div>
     <div className='h1'>
      <h1 className='o-nama'>O nama</h1>
      </div>
        <div className='prvi-deo'>
      
            
             <p className='opis'><h2>Mesto gde Niš uživa</h2>Dobro došli u naš Wellness centar, mesto gde se brinemo o vašem telu i duhu! Naša teretana i spa su dizajnirani kako bi vam pružili potpuni doživljaj zdravlja i wellnessa.
                 U našoj teretani ćete pronaći modernu opremu koja će vam pomoći u ostvarenju vaših fitnes ciljeva, uz stručno osoblje koje će vas pratiti u svakom koraku.
                 Naš spa centar vam nudi opuštajuću atmosferu i razne tretmane za lice i telo. Uživajte u masažama, aromaterapiji i drugim tretmanima koji će vam pomoći da se opustite i rešite stresa.
        
                Pridružite nam se i iskusite jedinstvenu kombinaciju fitnessa i opuštanja u našem wellness centru!</p>
           
            <img className='img3' src='./images/img-3.jpg' alt="Opis slike"/>
        </div>
        <div className='drugi-deo'>
        <img className='img4' src='./images/img-4.jpg' alt="Opis slike"/>
        {/* <img className='img6' src='./images/img-6.jpg' alt="Opis slike"/> */}
        <p className='opis'> <h2>Naša teretana</h2>Sa velikim klubom i desetinama sprava na raspolaganju, održaćeš jak tempo treninga bez obzira na broj vežbača u prostoru.
         Industrijska ventilacija i klimatizacija su tu da ti obezbede svež vazduh i stabilnu temperaturu za vežbanje. Za vrhunske rezultate je potrebna vrhunska oprema. Technogym je svetski lider u proizvodnji fitnes opreme i naš dugogodišnji partner u opremanju klubova. 
         Vežbaćeš lakše i efikasnije nego ikada jer ti poslednja reč fitnes tehologije pomaže da uspeš.</p>

        </div>
        <div className='treci-deo'>
          <p className='opis'><h2>Spa centar</h2> Profesionalno uredjen i opremljen Wellness & SPA Centar u Nišu. Samo par sati u wellness centru je dovoljno da povratite Vašu fizičku, psihičku i duhovnu ravnotežu. 
          Pronadjite svoju oazu mira i tišine, kutak u kome ćete zaboraviti na sve brige.Jednom rečju, WellNi Wellness centar nudi vrhunsko i jedinstveno spa iskustvo koje će vam omogućiti da dovedete svoje telo, um i dušu u savršen balans, a sve to zahvaljujući savremenim trendovima koji su kombinovani sa autentičnim pristupom wellness-u i lepoti.</p>
        <img className='img6' src='./images/img-6.jpg' alt="Opis slike"/> 
        </div>
    </div>
  )
}
