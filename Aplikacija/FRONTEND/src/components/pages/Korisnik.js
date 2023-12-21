import React, { useContext,useEffect,useState,useLayoutEffect } from 'react';
import '../Korisnik.css';
import '../../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth-context';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend
} from 'chart.js';
import {Bar} from 'react-chartjs-2'

function Korisnik() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [specijalnePonude,setSpecijalnePonude]=useState([]);
  const [showSpecijalnePonude, setShowSpecijalnePonude] = useState(false);
  const [broj, setBroj]= useState([]);
  const [zakazaniTermini, setZakazaniTermini] = useState([]);
  const [selectedTermini, setSelectedTermini] = useState([]);
  const [showZakazaniTermini, setShowZakazaniTermini] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const currentDate = new Date(); // Trenutni datum

  const minutesLeft = Math.floor(authCtx.sessionTimeLeft / 60000); // Pretvara milisekunde u minute
  const secondsLeft = Math.floor((authCtx.sessionTimeLeft % 60000) / 1000); // Pretvara preostale milisekunde u sekunde

  
  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

  useLayoutEffect (() => {
    if (!authCtx.isLoggedIn) {
      window.location.href = '/prijavi-se'; // Preusmeravanje na stranicu za prijavljivanje
    }
  }, [authCtx.isLoggedIn]);
  
  

  useEffect(() => {
    brojTerminaFetch();
  }, [zakazaniTermini]);

  useEffect(() => {
    if (authCtx.sessionTimeLeft <= 0) {
      authCtx.logout();
    }
  }, [authCtx.sessionTimeLeft, authCtx.logout]);

  const handleCheckboxChange2 = (event, termin) => {
    if (event.target.checked) {
      setSelectedTermini(termin);
    } else {
      setSelectedTermini(null);
    }
  };

  const brojTerminaFetch=()=>{
    fetch(`https://localhost:7193/Korisnik/ProveraBrojaTermina/${authCtx.username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${authCtx.token}`
      },
      
    }).then(async(odgovor)=>
    {if(odgovor.ok)
      {
        if (!showConfirmation) {
          setShowConfirmation(true);
          window.confirm("Ispunili ste normu za nagradu! Proverite Vas mail");
        }        
        const pr= await odgovor.json();
        setBroj(pr);
      }
      else{
        const pr= await odgovor.json();
        setBroj(pr);
      }

    })
    .catch((error)=>{
      console.log(error);
    });
  }
  
  const data = {
    labels:['Broj termina'],
    datasets: [
      {
        label:'Korisnik',
        data:[broj, 3, 4,5,15],
        backgroundColor: 'lightblue',
        borderColor: 'white',
        borderWidth: 1,
      }
      
    ]
  }

  
  const idiNaRecenzije = () => {
    navigate('/ostavi-recenziju');
  };

  const idiNaZakaziTermin = () => {
    navigate('/zakazi-termin');
  };

  const nacrtajSpecijalnePonude = async () => {
    setShowSpecijalnePonude(!showSpecijalnePonude); //da bi se kad se opet klikne, ugasilo
    try {
      const response = await axios.get('https://localhost:7193/SpecijalnePonude/VratiSpecijalnePonude', {
        headers: {
          'Authorization': `Bearer ${authCtx.token}`
        }
      });
      setSpecijalnePonude(response.data);
    } catch (error) {
      console.error(error);
    }
  
  };
  const dohvatiZakazaneTermine = async () => {
    try {
      const response = await axios.get(`https://localhost:7193/Korisnik/VratiMojeTermine/${authCtx.username}`, {
        headers: {
          'Authorization': `Bearer ${authCtx.token}`
        }
      });
      setZakazaniTermini(response.data);
      setShowZakazaniTermini(!showZakazaniTermini);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleCheckboxChange = (event, termin) => {
    setSelectedTermini(termin);
  };

  
  const otkaziTermini = async () => {
    if (selectedTermini) {
      const currentDate = new Date();
      const selectedDate = new Date(selectedTermini.datum);
  
      if (selectedDate < currentDate) {
        window.confirm("Ne mozete otkazati zakazani termin koji se vec desio!");
        return; // Prekini izvršavanje funkcije i ne šalji zahtev na server
      }
    }
    try {
      const response= await fetch(`https://localhost:7193/Korisnik/OtkaziZakazanTermin/${selectedTermini.naziv}/${selectedTermini.datum}/${selectedTermini.sat}/${authCtx.username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${authCtx.token}`
        }
      });
      const data = await response.text();
      window.confirm(data);
      setZakazaniTermini(zakazaniTermini.filter((termin) => ![selectedTermini].some((selected) => selected.id === termin.id)));
      setSelectedTermini([]);
    
    } catch (error) {
      console.error(error);
    }
  };

 
  return (
    <div
      className='container-korisnik'
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/img-5.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
       // height: '100vh',
        // width: '212.9vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      
      <a href="/" className="btn-vrati-na-pocetnu">Vrati me na početnu stranicu</a>
      <h1>Dobro došli {authCtx.username}!</h1>
      <p>Odaberite željenu akciju:</p>
      <div className='akcije'>
      <div className='levi-korisnik'>
      <button onClick={idiNaRecenzije}>Ostavi recenziju</button>
      <button onClick={idiNaZakaziTermin}>Zakaži termin</button>
      <button onClick={nacrtajSpecijalnePonude}>
        {showSpecijalnePonude ? 'Sakrij specijalne ponude' : 'Prikaži specijalne ponude'}
      </button>

      {showSpecijalnePonude && (
          <div className='div-vrati-spec-ponude'>
            {specijalnePonude.length > 0 ? (
              <table className='vrati-specijalne-ponude-admin'>
                <thead>
                  <tr>
                    <th>Naziv specijalne ponude</th>
                    <th>Opis</th>
                  </tr>
                </thead>
                <tbody>
                  {specijalnePonude.map((specijalnaPonuda) => (
                    <tr key={specijalnaPonuda.id}>
                      <td>{specijalnaPonuda.naziv}</td>
                      <td>{specijalnaPonuda.obavestenje}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nema specijalnih ponuda.</p>
            )}
          </div>

      )}
      <div className='za-bar'>
        <Bar data={data}></Bar>
      </div>
      <div className='sesija-korisnik'>
        {authCtx.sessionTimeLeft && <p>Vasa sesija istice: {minutesLeft}:{secondsLeft < 10 ? '0' : ''}{secondsLeft} min</p>} 
      </div>
      </div>


      <div>
          <div className='desni-korisnik'>
            <button onClick={dohvatiZakazaneTermine}>Prikaži zakazane termine</button>
            {showZakazaniTermini && zakazaniTermini.length > 0 ? (
              <div className='terminiK'>
                
                {zakazaniTermini.map((termin) => (
                  <div className='lista-termina' key={termin.id}>
                  {new Date(termin.datum) >= currentDate ? (
                            <>
                              <input
                                type='checkbox'
                                checked={selectedTermini === termin}
                                onChange={(event) => handleCheckboxChange(event, termin)}
                              />
                              <span>
                                {termin.naziv} {termin.sat} {termin.datum}
                              </span>
                            </>
                          ) : (
                            <span>
                              {termin.naziv} {termin.sat} {termin.datum}
                            </span>
                          )}
                    </div>
                ))}
                <button onClick={otkaziTermini}>Otkaži termin</button>
              </div>
            ) : showZakazaniTermini && zakazaniTermini.length < 0  ? (
              <p>Nema zakazanih termina.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default Korisnik;