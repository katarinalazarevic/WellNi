import React, { useState, useEffect, useContext,useLayoutEffect } from 'react';
import '../ZakaziTermin.css';
import { Await, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../auth-context';
import { faL } from '@fortawesome/free-solid-svg-icons';

function ZakaziTermin() {
  const navigate= useNavigate();
  const authCtx=useContext(AuthContext);
  console.log(authCtx.username);
  const [usluga, setUsluga] = useState('');
  const [datum, setDatum] = useState('');
  const [radnik,setRadnik]=useState('');
  const [showTermin, setShowTermin] = useState(false);
  const [options, setOptions] = useState([]);
  const [termini, setTermini] = useState([]);
  const [vreme, setVreme] = useState('');
  const [showZaposleni, setShowZaposleni] = useState(false);
  const [zaposleni, setZaposleni] = useState([]);
  const [approved,setApproved]=useState(false);

  useLayoutEffect (() => {
    if (!authCtx.isLoggedIn) {
      window.location.href = '/prijavi-se'; // Preusmeravanje na stranicu za prijavljivanje
    }
  }, [authCtx.isLoggedIn]);
  

  const handleProslediTermine = (event) => {
    
    fetch(`https://localhost:7193/ZaposleniUsluga/VratiVrsiocaUsluge/${datum}/${vreme}/${usluga}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authCtx.token}`
        },
      }).then(async(odgovor)=>
      {
        if(odgovor.ok)
        {
          const data= await odgovor.json();
          setZaposleni(data);
          setShowZaposleni(true);
        }
        else{
          var odg= await odgovor.text();
          window.confirm(odg);
        }
      })
      .catch((error)=>{
        console.log(error);
      });
    setApproved(true);
  };

  const handleVremeChange = (event) => {
    setVreme(event.target.value);
    setZaposleni([]);
  };

  const handleUslugaChange = (event) => {
    setUsluga(event.target.value);
    setShowTermin(true);
    setDatum('');
    setVreme('');
    setZaposleni([]);
  };

  const handleDatumChange = (event) => {
    setDatum(event.target.value);
    console.log(datum);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleZakaziTermin = async() => {
    try {
      const response= await fetch(`https://localhost:7193/Zakazivanje/ZakaziTermin/${datum}/${vreme}/${usluga}/${radnik}/${authCtx.username}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${authCtx.token}`
          },
          body: JSON.stringify({
            datum: datum,
            sat: vreme,
            nazivUsluge: usluga,
            imeZaposlenog: radnik,
            usernameKorisnika: authCtx.username,
          }),
        });
    
      const data = await response.text();
      window.confirm(data);
    } catch (error) {
        console.error("Greška prilikom rezervisanja termina:", error);
        window.confirm("Greška prilikom rezervisanja termina.");
    }
  
    setUsluga('');
    setDatum('');
    setVreme('');
    setShowTermin(false);
    setShowZaposleni(false);
  };

  const handleGoBack = () => {
    navigate('/korisnik');
  };

  const fetchOptions = async () => {
    try {
      const response = await axios.get('https://localhost:7193/Usluga/VratiUsluge', {
          headers: {
            'Authorization': `Bearer ${authCtx.token}`
          }
        });      
      setOptions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTermini = async (usluga) => {
    
      const response = await fetch(`https://localhost:7193/Usluga/TerminUsluge/${usluga}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authCtx.token}`
        },
      }).then(async(odgovor)=>
      {
        if(odgovor.ok)
        {
          const data= await odgovor.json();
          setShowTermin(true);
          setTermini(data);
        }
        else{
          var odg= await odgovor.text();
          console.log(odg);
        }
  
      })
      .catch((error)=>{
        console.log(error);
      });
    
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    console.log(datum);
    setZaposleni([]);
  }, [datum]);
  useEffect(() => {
    console.log(vreme);
  }, [vreme]);
  
  useEffect(() => {
    if (usluga) {
      fetchTermini(usluga);
    }
  }, [usluga]);

  

  return (
    <div
      className='container-zakazi-termin'
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/img-12.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Zakaži termin</h1>
       <form onSubmit={handleSubmit}> 
        <div>
          <label htmlFor='usluga'>Odaberite uslugu:</label>
          <select
            key='usluga'
            value={usluga}
            option={options}
            onChange={handleUslugaChange}
            required
          >
            <option value=''>Odaberite uslugu</option>
            {options.map((option) => (
              <option key={option.id} value={option.naziv}>
                {option.naziv}
              </option>
            ))}
          </select>
        </div>
        {showTermin && (
          <>
            <div className='kad-su'>
              {termini.length > 0 ? (
                <table className='kad-su-termini'>
                  {termini.map((termin) => (
                    <tr key={termin.id}>
                      <tr>Dan: {termin.dan} </tr>
                      <tr>  Sat: {termin.vreme} </tr>
                    </tr>
                  ))}
                </table>
              ) : (
                <p>Nema termina za datu uslugu.</p>
              )}
            </div>
            <div className='odabir-termina'>
              <label htmlFor='datum'>Unesite datum:</label>
              <input
                id='datum'
                type='date'
                value={datum }
                min={new Date().toISOString().slice(0, 10)} // Postavljanje minimalne vrednosti na trenutni datum
                onChange={handleDatumChange}
                required
              />    
            </div>
            <div>
              <input
                type='time'
                name='time'
                min='7:30'
                max='20:30'
                value={vreme}
                onChange={handleVremeChange}
                required
              />
            </div>
          </>
        )}
        <button type='submit' onClick={handleProslediTermine}>Posaljite termin</button>
        {showZaposleni && (
          <div className='odabir-zaposlenog'>
            <label htmlFor='zaposleni'>Odaberite zaposlenog:</label>
            <select
              id='zaposleni'
              value={radnik}
              onChange={(event) => setRadnik(event.target.value)}
              required
            >
              <option value=''>Odaberite zaposlenog</option>
              {zaposleni.map((zaposlen) => (
                <option key={zaposlen.id} value={zaposlen.ime}> 
                {/* proveri da li je u value zaposlen.id */}
                  {zaposlen.ime} {zaposlen.prezime}
                </option>
              ))}
            </select>
       

          </div>
        )}
        <button type='submit' onClick={handleZakaziTermin}>
          Zakaži termin
        </button>
        <button onClick={handleGoBack}>←</button>
       </form> 
    </div>
  );

}

export default ZakaziTermin;