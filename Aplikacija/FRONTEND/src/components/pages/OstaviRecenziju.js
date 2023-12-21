import React, { useContext, useState,useEffect,useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../OstaviRecenziju.css';
import axios from 'axios';

import AuthContext from '../auth-context';

function OstaviRecenziju() {
  const authCtx=useContext(AuthContext);
  const navigate = useNavigate();
  const [ocena, setOcena] = useState('');
  const [komentar, setKomentar] = useState('');
  const [usluga, setUsluga] = useState('');
  const [options,setOptions]=useState([]);
  
  useLayoutEffect (() => {
    if (!authCtx.isLoggedIn) {
      window.location.href = '/prijavi-se'; // Preusmeravanje na stranicu za prijavljivanje
    }
  }, [authCtx.isLoggedIn]);
  

  const handleOcenaChange = (event) => {
    setOcena(event.target.value);
  };

  const handleKomentarChange = (event) => {
    setKomentar(event.target.value);
  };

  const handleUslugaChange = (event) => {
    setUsluga(event.target.value);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Recenzija poslata:', {
      ocena,
      komentar,
      usluga
    });
    setOcena('');
    setKomentar('');
    setUsluga('');
  };

  const handleOstaviRecenziju=()=>
  {
    fetch(`https://localhost:7193/Recenzije/DodajRecenziju/${authCtx.username}/${ocena}/${komentar}/${usluga}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${authCtx.token}`
      },
      body:JSON.stringify({
        usernameK:authCtx.username,
        ocena:ocena,
        komentar:komentar,
        nazivUsluge:usluga,
      }),
    }).then(odgovor=>odgovor.text())
      .then(odgovorText=> {
        window.confirm(odgovorText);
    })
      .catch((error)=>{
          window.confirm("Greska prilikom rezervisanja");
    });
  }

  const handleGoBack = () => {
    navigate('/korisnik');
  };

  return (
    <div
      className='ostavi-recenziju'
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/img-11.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 className='naslov-ostavi-recenziju'>Ostavi recenziju</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='ocena'>Ocena:</label>
          <input
            className='input-ocena'
            type='number'
            value={ocena}
            onChange={handleOcenaChange}
            required
            max={5}
            min={0}
          />
        </div>
        <div>
          <label htmlFor='komentar'>Komentar:</label>
          <textarea
            className='textarea-komentar'
            value={komentar}
            onChange={handleKomentarChange}
            required
          />
        </div>
        <div>
          <label htmlFor='zaposleni'>Za uslugu:</label>
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
        <button type='submit' onClick={handleOstaviRecenziju}> Ostavi recenziju</button>
      </form>
      <button onClick={handleGoBack}>←</button>
    </div>
  );
}

export default OstaviRecenziju;