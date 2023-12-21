import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Prijavljivanje.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';



const PrijaviSe = () => {
  const authCtx = useContext(AuthContext);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();
  const handleIspitivanje= () => {
    if(username.includes("Trener"))
     { handleLoginZaposleni(); }
     else  if(username.includes("Spa"))
     { handleLoginZaposleni(); }
    else if(username.includes("Admin"))
     { handleLoginAdministrator(); }
    else
     { handleLoginKorisnik(); }
  }

  const handleLoginAdministrator=()=>
  {
    fetch("https://localhost:7193/Korisnik/Login",{
      method: "POST",
      headers:{
        "Content-Type" :"application/json",
      },
      body: JSON.stringify({
        username:username,
        password:password,
      }),
    }).then(async(odgovor)=>
    {if(odgovor.ok)
      {
        const token=await odgovor.text();
     
        authCtx.login(token,username);
        authCtx.isLoggedIn=true;
        navigate('/administrator');
     }
      else{
        var odg= await odgovor.text();
        window.confirm(odg);
      }

    })
    .catch((error)=>{
      console.log(error);
    });
    }

  const handleLoginZaposleni=()=>
  {
    fetch("https://localhost:7193/Zaposleni/LoginZaposleni",{
      method: "POST",
      headers:{
        "Content-Type" :"application/json",
      },
      body: JSON.stringify({
        username:username,
        password:password,
      }),
    }).then(async(odgovor)=>
    {if(odgovor.ok)
      {
        const token=await odgovor.text();
     
        authCtx.login(token,username);
        authCtx.isLoggedIn=true;
        navigate('/zaposleni');
     }
      else{
        var odg= await odgovor.text();
        window.confirm(odg);
      }

    })
    .catch((error)=>{
      console.log(error);
    });
    }

  const handleLoginKorisnik = async () => {

    fetch("https://localhost:7193/Korisnik/Login",{
      method: "POST",
      headers:{
        "Content-Type" :"application/json",
      },
      body: JSON.stringify({
        username:username,
        password:password,
      }),
    }).then(async(odgovor)=>
      {if(odgovor.ok)
        {
          const token=await odgovor.text();
       
          authCtx.login(token,username);
          authCtx.isLoggedIn=true;
          localStorage.setItem('isLoggedIn',true);
          navigate('/korisnik');
       }
        else{
          var odg= await odgovor.text();
          window.confirm(odg);
        }

      })
      .catch((error)=>{
        console.log(error);
      });
    }
  return (
    <div className='container-prijavise'
    style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/img-13.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',        
        display: 'flex',
        //flexWrap:'wrap',
        //justifyContent: 'center',
        // alignItems: 'center',
      }}>
      
        <label>
          Username:
          <input
            type='text'
            name='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>


       <label>

        Password:
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle-button"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
      </label>
      <p className='nemas-nalog'>
          <Link to ='/zaboravljena-sifra' className='link'>Zaboravili ste lozinku?</Link>
        </p>
        <button onClick={handleIspitivanje} type='submit' className='prijavi-se-dugme'>
          Prijavi se
        </button>
        <p className='nemas-nalog'>
          Nemaš nalog? <Link to='/registracija' className='link'>Registruj se</Link>
        </p>


      
    </div>
  );
};

export default PrijaviSe;