import '../SpaKomponenta.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../../App.css';
import SadrzajSpa from '../SadrzajSpa';
import UslugeCards from '../UslugeCards';

const Spa = () => {
  const [spa, setSpa] = useState([]);
  const [prikaziSortiranoSpa, setPrikaziSortiranoSpa] = useState(false);
  const [sortirano, setSortirano] = useState(false);

  useEffect(() => {
     {
      fetchSpaData();
    }
  }, []);

  const fetchSpaData = async () => {
    try {
      const response = await axios.get('https://localhost:7193/Usluga/VratiUslugeSpa');
      setSpa(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  
  const handleDugmeKlikSpa = async() => {
    setPrikaziSortiranoSpa(!prikaziSortiranoSpa);

  };

  const sortirajPoCeni = () => {
    setSortirano(!sortirano);
  };

  const sortiraneUsluge = [...spa].sort((a, b) => {
    return sortirano ? a.cena - b.cena : b.cena - a.cena;
  });
   
  // const sortirajSpa = () => {
  //   const sortiraneUsluge = [...spa].sort((a, b) => b.cena - a.cena);
  //   return (
  //     <div className='mojeUslugeSpa'>
  //     <table className='tabelaSpa'>
  //       {/* <h1 className='teretanaUsluge'>Teretana usluge</h1> */}
  //       {sortiraneUsluge.map((uslugeSpa) => (
  //         <div className='tr-uslugeSpa'>
  //           <tr className='spaTr'key={uslugeSpa.id}>
  //             <div className='naziv-uslugeSpa'>
  //               <td>{uslugeSpa.naziv}</td>
  //             </div>
  //             <div className='cenaSpa'>
  //               <td>Cena: {uslugeSpa.cena} din</td>
  //             </div>
  //             <div className='trajanjeSpa'>
  //               <td>Duzina trajanja: {uslugeSpa.duzinaTrajanja} min</td>
  //             </div>
  //           </tr>
  //         </div>
  //       ))}
  //     </table>
  //     {/* <button className='dugmeTeretana' onClick={handleDugmeKlikTeretana}>
  //         Vrati originalne usluge teretane
  //       </button> */}
  //     </div>
  //   );
  //};

  return (
    <div className='container-spa'>
      <div className='container-slikaspa'>
      {/* <img className='naslovnaspa' src='./images/naslovna spa.jpg' alt="Opis slike" />
      <div className='slikaspa-div' style={{ position: 'absolute', top: '62%', left: '50%', transform: 'translate(-50%, -50%)' }}> */}
        <h1 className='tekst-prekospa'>SPA</h1>
        <p className='podtekst'>- Peace in your body -</p>
      </div>
      <div className='velikispa'><img className='spa2' src='./images/spa2(lepa).jpg' alt="Opis slike" />
        <div className='container-tekstspa'>
          <h1 className='benefiti'>Benefiti</h1>
          <p className='opis-spa' style={{ fontFamily: 'Monaco' }}> SPA centri su dizajnirani da pruže opuštajuću atmosferu i aktivnosti koje pomažu u smanjenju stresa. Nude različite terapije koje mogu pomoći u osnaživanju fizičkog i mentalnog zdravlja. Masaže mogu poboljšati cirkulaciju, smanjiti mišićnu napetost i ublažiti bol. Fizičke terapije, masaže dubokog tkiva i terapije sa toplim kamenjem mogu olakšati bolove u mišićima i zglobovima, uvećati fleksibilnost i ubrzati proces oporavka.  Masaža i terapije opuštanja mogu smanjiti nesanicu, unaprediti ritam spavanja i doprineti dubljem i kvalitetnijem snu. 
          </p>
        </div>
        <img className='spa4' src='./images/spa4(lepa).jpg' alt="Opis slike" />
      </div>

      <div className='sadrzaj-spa'>
          {SadrzajSpa.map((item, index) => (
             <UslugeCards key={index} item={item} />
          ))}
      </div>
      
      <div className='mojeUslugeSpa'>
          <button onClick={sortirajPoCeni} className='dugmeTeretana'>
          Sortiraj po ceni: {sortirano ? "Rastuće" : "Opadajuće"}
        </button>
        {spa.length > 0 && (
          <table className='tabelaSpa'>
            <thead>
              <tr>
                <th>Naziv usluge</th>
                <th>Cena</th>
                <th>Dužina trajanja</th>
              </tr>
            </thead>
            <tbody>
              {
                sortiraneUsluge.map((usluga)=>(
                  <tr key={usluga.id}>
                    <td>{usluga.naziv}</td>
                    <td>{usluga.cena} din</td>
                    <td>{usluga.duzinaTrajanja} min</td>
                  </tr>
                ))
              }

            </tbody>
          </table>
        )}
      </div>
      
    </div>
    
    
  );
}

export default Spa;