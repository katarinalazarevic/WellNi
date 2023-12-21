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

  const handleZahtev=async()=> {
    fetch(`https://localhost:7193/Korisnik/PromeniSifru/${email}`,{
        method:"POST",
        headers:{
          "Content-Type" :"application/json",
        }
         
        }).then(async (response) => {
        if (response.ok) {

          window.confirm("Proverite Vas email radi promene lozinke!");
          
          setEmail('');
          
        } else {
          const responseText = await response.text();
          window.confirm(responseText);
        }
      })
      .catch((error)=>{
        console.log(error);
      });
    }


  

  return (
    <div className='container-podaci-registracija'style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/img-13.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
      }}>

        <label>
          Unesite Email:
          <input
            type='text'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        
        <button onClick={handleZahtev}type="submit" className='registruj-se-dugme'>Pošalji zahtev</button>
      
    </div>
  );
}

export default Registracija;