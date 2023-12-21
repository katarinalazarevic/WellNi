import '../TeretanaKomponenta.css'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import SadrzajTeretane from '../SadrzajTeretane';

import UslugeCards from '../UslugeCards';

const Teretana = () => {
    const [teretana, setTeretana] = useState([]);
    const [prikaziSortiranoTeretana, setPrikaziSortiranoTeretana] = useState(false);
    const [sortirano, setSortirano] = useState(false);
    useEffect(() => {
      {
      fetchTeretana();
      }
    }, []);
  
    const fetchTeretana = async () => {
      try {
        const response = await axios.get('https://localhost:7193/Usluga/VratiUslugeTeretana');
        setTeretana(response.data);
      } catch (error) {
        console.error(error);
      }
    };


    // const handleDugmeKlikTeretana = async() => {
    //   setPrikaziSortiranoTeretana(!prikaziSortiranoTeretana);

    // };
    
    
  
    const sortirajPoCeni = () => {
      setSortirano(!sortirano);
    };
  
    const sortiraneUsluge = [...teretana].sort((a, b) => {
      return sortirano ? a.cena - b.cena : b.cena - a.cena;
    });
    
  


    return (
      <div className='container-gym'>
        <div className='container-slikagym'>
        {/* <img className='naslovnateretana' src='./images/naslovnagym.jpg' alt="Opis slike"/> */}
        {/* <div className='slikagym-div' style={{ position: 'absolute', top: '62%', left: '50%', transform: 'translate(-50%, -50%)' }}> */}
          <h1 className='tekst-prekogym'>TERETANA</h1>
          <p className='podtekstgym'>- Healthy body, healthy soul -</p>
  
        </div>
        <div className='velikigym'>
        <img className='teretana' src='./images/teretana.jpg' alt="Opis slike"/>
          <div className='container-tekstgym'>
        
          <h1 className='oteretani'>Opis</h1>
          <p className='opis-gym' style={{ fontFamily: 'Monaco'}}> Teretana je prostor opremljen različitim fitnes spravama i rekvizitima koji omogućavaju vežbanje i razvoj snage, mišićne mase i kondicije. U teretani se mogu izvoditi raznovrsne vežbe kao što su dizanje tegova, trening sa slobodnim tegovima, kardio vežbe, vežbe sa spravama za snagu i još mnogo toga. Teretana pruža mogućnost za ciljano oblikovanje tela, jačanje mišića, poboljšanje kondicije i postizanje fitnes ciljeva. Uz pravilno vođenje trenera, teretana može biti sigurno i efikasno mesto za postizanje željenih rezultata.
          </p>
          </div>
            
          <img className='teretana1' src='./images/teretana1.jpg' alt="Opis slike"/>
        </div>
       

    <div className='sadrzaj-teretane'>
        {SadrzajTeretane.map((item, index) => (
           <UslugeCards key={index} item={item} />
        ))}
    </div>
      <div className='mojeUslugeTeretana'>
        <button onClick={sortirajPoCeni} className='dugmeTeretana'>
          Sortiraj po ceni: {sortirano ? "Rastuće" : "Opadajuće"}
        </button>
        {teretana.length > 0 && (
          <table className="tabelaTeretana">
            <thead>
              <tr>
                <th>Naziv usluge</th>
                <th>Cena</th>
                <th>Dužina trajanja</th>
              </tr>
            </thead>
            <tbody>
              {sortiraneUsluge.map((usluga) => (
                <tr key={usluga.id}>
                  <td>{usluga.naziv}</td>
                  <td>{usluga.cena} din</td>
                  <td>{usluga.duzinaTrajanja} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

  </div>
);
  
}

export default Teretana;