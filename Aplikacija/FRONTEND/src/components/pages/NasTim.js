import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import '../NasTim.css';

const NasTim = () => {
  const [nastim, setNasTim] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');

  useEffect(() => {
    fetchNasTim();
  }, [selectedProfession]);

  const fetchNasTim = async () => {
    try {
      const response = await axios.get('https://localhost:7193/Zaposleni/VratiZaposlene');
      setNasTim(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfessionFilter = (event) => {
    const selectedValue = event.target.value;
    setSelectedProfession((prevSelectedProfession) => {
      if (prevSelectedProfession === selectedValue) {
        return ''; // Odčeckiranje checkboxa ako je već bio selektovan
      }
      return selectedValue;
    });
  };

  const filteredNasTim = selectedProfession
    ? nastim.filter((tim) => tim.zanimanje === selectedProfession)
    : nastim;

  return (
    <div className='container-nas-tim'>
      <div className='container-slika'>
        {/* <img className='img9' src='./images/img-1.jpg'/> */}
        {/* <div className='slika-div' style={{ position: 'absolute', top: '62%', left: '50%', transform: 'translate(-50%, -50%)' }}> */}
        <h1 className='tekst-preko'>Naš tim</h1>
        <p className='upoznajte'>- Upoznajte stručno osoblje WellNi tima -</p>
        {/* </div> */}
      </div>
      <div className='veliki'>
        <img className='img7' src='./images/img-7.jpg' alt='Opis slike' />
        <div className='container-tekst'>
          <h1 className='strucnost'>Stručnost</h1>
          <p className='opis-tima' style={{ fontFamily: 'Monaco' }}>
            Personalni treneri poseduju napredne veštine za određivanje i kreiranje treninga.
            Obučeni su za rad sa decom, profesionalnim sportistima, ali i za rad sa klijentima sa posebnim potrebama.
            Biti personalan trener podrazumeva puno toga, od sposobnosti da pruži odgovarajuća dijetetska uputstva,
            preko organizacije treninga, do velike moći motivacije svakog klijenta.
            <p className='opis-tima' style={{ fontFamily: 'Monaco' }}>
              Fizioterapeuti i osoblje u spa centru su izuzetno stručni i posvećeni pružanju vrhunske zdravstvene i wellness usluge svojim klijentima.
              Oni poseduju duboko znanje o ljudskom telu, rehabilitaciji i različitim terapijskim tehnikama.
              Fizioterapeuti su obučeni za dijagnostikovanje i tretiranje različitih fizičkih problema i povreda.
              Koriste svoje veštine kako bi pomogli klijentima u prevazilaženju bola, obnovi pokretljivosti i poboljšanju funkcionalnosti tela.
              Njihova stručnost obuhvata širok spektar terapija, uključujući masažu, vežbe, mobilizaciju zglobova, elektroterapiju i druge tehnike rehabilitacije.
            </p>
          </p>
        </div>
        <img className='img11' src='./images/img-9.png' alt='Opis slike' />
      </div>
      <div className='div-osoblje'>
          <div className='filter'>
            <p style={{marginBottom: '20px'}}>Filtrirajte osoblje po zanimanju:</p>
            <label className='nasTim-label'>
              <input
                type='checkbox'
                value='Trener'
                checked={selectedProfession === 'Trener'}
                onChange={handleProfessionFilter}
              />
              Trener
            </label>
            <label className='nasTim-label'>
              <input
                type='checkbox'
                value='Fizioterapeut'
                checked={selectedProfession === 'Fizioterapeut'}
                onChange={handleProfessionFilter}
              />
              Fizioterapeut
            </label>
          </div>
          {filteredNasTim.length > 0 ? (
            <div className='mojNasTim'>
              <table>
                <h1 className='osoblje'>Osoblje</h1>
                {filteredNasTim.map((tim) => (
                  <div className='tr-tim' key={tim.id}>
                    <tr className='nasTimTr'>
                      <div className='ime-zaposlenog'>
                        <tr>{tim.ime} {tim.prezime}</tr>
                      </div>
                      <div className='zanimanje'>
                        <tr>Zanimanje: {tim.zanimanje}</tr>
                      </div>
                    </tr>
                  </div>
                ))}
              </table>
            </div>
          ) : (
            <p>Nema članova tima.</p>
          )}
          </div>
    </div>
  );
};

export default NasTim;
