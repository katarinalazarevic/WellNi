import React, { useState } from 'react';
import '../RegistracijaNaloga.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


function Registracija() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const[pol,setPol]=useState('');
  const[kontakt,setKontakt]=useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegistration=async()=> {
    if(username.includes("Trener")|| username.includes("Spa") || username.includes("Admin"))
    {
      window.confirm("Username sadrzi reci koje ne sme da sadrzi")
    }
    else{
       fetch("https://localhost:7193/Korisnik/Register",{
        method:"POST",
        headers:{
          "Content-Type" :"application/json",
        },
        body: JSON.stringify({
          username:username,
          password:password,
          email:email,
          ime:ime,
          prezime:prezime,
          pol:pol,
          kontakt:kontakt,
         
        }),
      }).then(async (response) => {
        if (response.ok) {
          window.confirm("Uspesno ste se registrovali! Pogledajte Vas mail da biste potvrdili nalog!");
          setUsername('');
          setPassword('');
          setIme('');
          setPrezime('');
          setEmail('');
          setPol('');
          setKontakt('');
        } else {
          const responseText = await response.text();
          window.confirm(responseText);
        }
      })
      .catch((error)=>{
        console.log(error);
      });
    }

    
  }
  

  return (
    <div className='container-podaci-registracija'style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/img-13.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
      }}>
      {/* <form className='form' onSubmit={handleSubmit}> */}
        <label>
          Ime:
          <input
            type='text'
            name='ime'
            value={ime}
            onChange={(e) => setIme(e.target.value)}
          />
        </label>
        <label>
          Prezime:
          <input
            type='text'
            name='prezime'
            value={prezime}
            onChange={(e) => setPrezime(e.target.value)}
          />
        </label>
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
          Email:
          <input
            type='text'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <label>
          Pol:
          <input
            type='text'
            name="pol"
            value={pol}
            onChange={(e) => setPol(e.target.value)}
          />
        </label>
        <label>
          Broj telefona:
          <input
            type="number"
            name="kontakt"
            value={kontakt}
            onChange={(e) => setKontakt(e.target.value)}
          />
        </label>

        <button onClick={handleRegistration}type="submit" className='registruj-se-dugme'>Registruj se</button>
      {/* </form> */}
    </div>
  );
}

export default Registracija;