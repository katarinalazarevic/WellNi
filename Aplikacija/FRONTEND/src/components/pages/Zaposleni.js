import React, { useState, useEffect, useContext,useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Zaposleni.css';
import '../../App.css';
import AuthContext from '../auth-context';
function Zaposleni() {
  const navigate= useNavigate();
  const authCtx=useContext(AuthContext);
  const [termini, setTermini] = useState([]);
  const [dugmeKliknuto, setDugmeKliknuto] = useState(false);
  const [dugmeKliknuto2, setDugmeKliknuto2] = useState(false);
  const [dugmeKliknuto3, setDugmeKliknuto3] = useState(false);
  const [datum2, setDatum2] = useState(null);
  const [datumPrikazan, setDatumPrikazan] = useState(false);
  const [vreme2, setVreme2] = useState(null);
  const[vreme,setVreme]=useState('');
  const[vremeOptions,setVremeOptions]=useState([]);
  const [options, setOptions] = useState([]);
  const [usluga, setUsluga] = useState('');
  const [showTermin, setShowTermin] = useState(false);
  const [terminiPrikazani, setTerminiPrikazani] = useState(false);

  const minutesLeft = Math.floor(authCtx.sessionTimeLeft / 60000); // Pretvara milisekunde u minute
  const secondsLeft = Math.floor((authCtx.sessionTimeLeft % 60000) / 1000); // Pretvara preostale milisekunde u sekunde


  useLayoutEffect (() => {
    if (!authCtx.isLoggedIn) {
      window.location.href = '/prijavi-se'; // Preusmeravanje na stranicu za prijavljivanje
    }
  }, [authCtx.isLoggedIn]);

  useEffect(() => {
    console.log(datum2);
  }, [datum2]);

  useEffect(() => {
    console.log(vremeOptions);
  }, [vremeOptions]);

  const fetchTermini = async () => {
     const response = await fetch(`https://localhost:7193/ZaposleniUsluga/VratiMojeTermine/${authCtx.username}`, {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${authCtx.token}`
        },
        body:JSON.stringify({
          usernameZaposlenog:authCtx.username,
        }),
      }).then(async(odgovor)=>
       {if(odgovor.ok)
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
      })   
  };

  useEffect(() => {
    if (datum2 && vreme) {
      fetchOptions(datum2,vreme);
    }
  }, [datum2, vreme]);

  const fetchOptions = async (datum2,vreme) => {
      fetch(`https://localhost:7193/ZaposleniUsluga/VratiUslugeVrsioca/${datum2}/${vreme}/${authCtx.username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${authCtx.token}`
        },body:JSON.stringify({
          datum:datum2,
          vreme:vreme,
          usernameZaposlenog:authCtx.username
        }),
      }).then(async(odgovor)=>{
        if(odgovor.ok)
        {
          const data= await odgovor.json();
          setOptions(data);
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

  const handleDugmeKlik = () => {
    setDugmeKliknuto(!dugmeKliknuto);
    setTerminiPrikazani(!terminiPrikazani);
    setTermini([]); 
  };

  const handleDugmeKlik2 = () => {
    setDugmeKliknuto2(!dugmeKliknuto2);
    setTermini([]); 
    setDatumPrikazan(!datumPrikazan); // Promena stanja prikaza datuma
  };

  
  const handleDatumChange2 = (event) => {

    setDatum2(event.target.value);
    setVremeOptions([]);
    setOptions([]);
  }; 

  useEffect(() => {
    if (datum2) {
      handlePrikaziVreme(datum2);
    }
  }, [datum2]);

  const handlePrikaziVreme= (datum2)=>
  {

    fetch(`https://localhost:7193/Usluga/VratiVremeUsluge/${datum2}/${authCtx.username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${authCtx.token}`
      },
      body:JSON.stringify({
        datum:datum2,
        usernameZaposlenog:authCtx.username
      }),
    })
    .then(async(odgovor)=>{
      if(odgovor.ok)
      {
          const data = await odgovor.json();
          if (data.length === 0) {
            // Prikazati obaveštenje da je odgovor prazan niz
            window.confirm('Nemate termin za izabrani datum');
          }      
          else {
          setVremeOptions(data);
          }
      }
      else{
          var odg= await odgovor.text();
          console.log(odg);
      }
    })
    .catch((error)=>{
        console.log(error);
    });
  }


  const handleOtkazi= ()=>{
    fetch(`https://localhost:7193/Zaposleni/OtkaziTermin/${usluga}/${datum2}/${vreme}/${authCtx.username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${authCtx.token}`
      },
      body:JSON.stringify({
        datum:datum2,
        usernameZaposlenog:authCtx.username,
        usluga:usluga,
        sat:vreme,
      }),
    })
    .then(async(odgovor)=>
      {
        if(odgovor.ok)
        {
          var odg= await odgovor.text();
          console.log(odg);
          window.confirm(odg);
           setVremeOptions([]);
           setOptions([]);
          setDatum2(null);
        }
        else{
          var odg= await odgovor.text();
          console.log(odg);
        }
  
      })
      .catch((error)=>{
        console.log(error);
      });
    
  }

  const handleSubmit = (event)=> {
    event.preventDefault();
    setDatum2('');
    setVreme2('');
    setShowTermin(false);
  };
  const handleUslugaChange2 = (event) => {
    setUsluga(event.target.value);
    
  };
 
  useEffect(() => {
    if (dugmeKliknuto) {
      fetchTermini();
    }
  }, [dugmeKliknuto]);

  return (
    
    <div className='container-termini'>
        <h1 className='tekstPrekoZaposlenih'>Dobro došli {authCtx.username}!</h1>
        <div className='dugmici-zaposleni'>
        <button className='dugmeZaposleni'onClick={handleDugmeKlik}>Prikaz mojih termina</button>
     
      {/* <button className='dugmeZaposleni2'onClick={handleDugmeKlik2}>Otkazi uslugu</button> */}

      {dugmeKliknuto  && terminiPrikazani ? (
        <div className='mojiTermini'>
          {termini.map((termin) => (
            <div className='termin-div' key={termin}>
              <h2 className='zaposleniUsluga'>{termin.usluga}</h2>
              <table className='tabelaTermini'>
                <tbody>
                  {termin.termini.map((item) => (
                    <tr  key={item}>
                      <td className='zaposleniDan'>Dan: {item.dan}</td>
                      <td className='zaposleniSat'>Sat: {item.sat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        
      ) : (
        !dugmeKliknuto && <p></p>
      )}
      <button className='dugmeZaposleni2'onClick={handleDugmeKlik2}>Otkazi uslugu</button>
        {dugmeKliknuto2 && datumPrikazan? ( 
        
        <form onSubmit={handleSubmit}>
          <div className='mojDatum'> 
           <label className='' htmlFor='datum'>Unesite datum:</label> 
            <input
              id='datum'
              type='date'
              value={datum2 || new Date().toISOString().slice(0, 10)}
              min={new Date().toISOString().slice(0, 10)} // Postavljanje minimalne vrednosti na trenutni datum
              onChange={handleDatumChange2}
              required
              />
          </div>
          <div className='mojeVreme'>
            <label htmlFor='vreme'>Odaberite vreme: </label>
            <select
            key='usluga'
            value={vreme}
            option={vremeOptions}
            onChange={(event) => setVreme(event.target.value)}
            required
          >
            <option value=''></option>
            {vremeOptions.map((option) => (
              <option key={option.id} value={option.sat}>
                {option.sat}
              </option>))}
            </select> 
              
          </div>
          <div className='divUsluge'>
            <label htmlFor='usluga'>Odaberite uslugu:</label>
            <select
            key='usluga'
            value={usluga}
            option={options}
            onChange={handleUslugaChange2}
            required
          >
            <option value=''>Odaberite uslugu</option>
            {options.map((option) => (
              <option key={option.id} value={option.naziv}>
                {option.naziv}
              </option>))}
          </select>
          </div>
          <button className='button-administrator' type='submit' onClick={handleOtkazi}>Otkazite zakazan termin</button>
          </form>
        ) : (
          !dugmeKliknuto2 && <p></p>
        )}
      </div>
      <div className='sesija-zaposleni'>
        {authCtx.sessionTimeLeft && <p>Vasa sesija istice: {minutesLeft}:{secondsLeft < 10 ? '0' : ''}{secondsLeft} min</p>} 
      </div>
    </div>
  );
}

export default Zaposleni;
