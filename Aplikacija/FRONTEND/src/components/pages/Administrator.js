import React, { useContext,useState,useEffect,useLayoutEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import '../Administrator.css';
  import AuthContext from '../auth-context';
  import axios from 'axios';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

  function Administrator() {
    const navigate= useNavigate();
    const authCtx=useContext(AuthContext);
    //console.log(authCtx.username);
    const [showDeleteInput, setShowDeleteInput] = useState(false);
    const [showAddInput, setShowAddInput] = useState(false);
    const [showEditInput, setShowEditInput] = useState(false);
    const [showAddTerminInput, setShowAddTerminInput] = useState(false);
    const [showAddZaposleniInput, setShowAddZaposleniInput] = useState(false);
    const [showAddZaposlenogUsluziInput, setShowAddZaposlenogUsluziInput] = useState(false);
    const [showDeleteZaposlenogInput, setShowDeleteZaposlenogInput] = useState(false);
    const [showSpecijalnePonudeInput, setShowSpecijalnePonudeInput] = useState(false);
    const [showDeleteSpecijalnePonudeInput,setShowDeleteSpecijalnePonudeInput] = useState(false);
    const [showVratiSveUslugeInput, setShowVratiSveUslugeInput]= useState(false);
    const [showVratiSveTermineInput, setShowVratiSveTermineInput] = useState(false);
    const [showVratiSveZaposleneInput, setShowVratiSveZaposleneInput] = useState(false);
    const [showDeleteZaposlenogIzUslugeInput, setShowDeleteZaposlenogIzUslugeInput] = useState(false);
    const [showVratiSveSpecijalnePonudeInput, setShowVratiSveSpecijalnePonudeInput] = useState(false);
    const [showVratiZaposleneINjihoveUslugeInput,setShowVratiZaposleneINjihoveUslugeInput] = useState(false);
    const[showRegistrujAdministratora,setShowAdministratora]=useState(false);

    const minutesLeft = Math.floor(authCtx.sessionTimeLeft / 60000); // Pretvara milisekunde u minute
    const secondsLeft = Math.floor((authCtx.sessionTimeLeft % 60000) / 1000); // Pretvara preostale milisekunde u sekunde
  
    const [usluge, setUsluge]=useState([]);
    const [zaposleni, setZaposleni]=useState([]);
    const [termini, setTermini]= useState([]);
    const[showVratiZakazivanjaInput,setShowVratiZakazivanjaInput]=useState(false);
    const[zakazivanja,setZakazivanja]=useState([]);
    const [specijalnePonude, setSpecijalnePonude]= useState([]);
    const [zaposleniIUsluge, setZaposleniIUsluge] = useState([]);
    

    const [nazivUsluge,setNazivUsluge]=useState('');
    const [imeZaposlenog,setImeZaposlenog]=useState('');
    const [cenaUsluge,setCenuUsluge]=useState('');
    const [tipUsluge,setTipUsluge]=useState('');
    const [maxKapacitetUsluge,setmaxKapacitetUsluge]=useState('');
    const [trajanjeUsluge,settrajanjeUsluge]=useState('');
    const [vremeTermina, setVremeTermina] = useState('');
    const [datumTermina, setDatumTermina] = useState('');
    const [prezimeZaposlenog, setPrezimeZaposlenog] = useState('');
    const [zanimanjeZaposlenog, setZanimanjeZaposlenog] = useState('');
    const [usernameZaposlenog, setUsernameZaposlenog] = useState('');
    const [passwordZaposlenog, setPasswordZaposlenog] = useState('');
    const [nazivSpecijalnePonude, setNazivSpecijalnePonude] = useState('');
    const [obavestenjeSpecijalnePonude, setObavestenjeSpecijalnePonude] = useState('');
    const [noviNazivUsluge,setNoviNazivUsluge]=useState('');
    const [emailZaposlenog,setEmailZaposlenog]=useState('');
    const[usernameAdmin,setUsernameAdmin]=useState('');
    const[imeAdmin,setImeAdmin]=useState('');
    const[prezimeAdmin,setPrezimeAdmin]=useState('');
    const[emailAdmin,setEmailAdmin]=useState('');
    const[passwordAdmin,setPasswordAdmin]=useState('');
    const[showPassword,setShowPassword]=useState(false);
    const[polAdmin,setPolAdmin]=useState('');
    const[kontaktAdmin,setKontaktAdmin]=useState('');


    useLayoutEffect (() => {
      if (!authCtx.isLoggedIn) {
        window.location.href = '/prijavi-se'; // Preusmeravanje na stranicu za prijavljivanje
      }
    }, [authCtx.isLoggedIn]);


    const handleDeleteClick = () => {
      setShowDeleteInput(!showDeleteInput);
      setShowAddInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveTermineInput (false);
      setShowVratiZakazivanjaInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowAdministratora(false);
    };

    const handleAddClick = () => {
      setShowAddInput(!showAddInput);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveTermineInput (false);
      setShowVratiZakazivanjaInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowAdministratora(false);
    };

    const handleEditClick = () => {
      setShowEditInput(!showEditInput);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveTermineInput (false);
      setShowVratiSveUslugeInput(false);
      setShowVratiZakazivanjaInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
    };

    const handleAddTerminClick = () => {
      setShowAddTerminInput(!showAddTerminInput);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveTermineInput (false);
      setShowVratiSveUslugeInput(false);
      setShowVratiZakazivanjaInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
    };

    const handleAddZaposleniClick = () => {
      setShowAddZaposleniInput(!showAddZaposleniInput);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveTermineInput (false);
      setShowVratiSveUslugeInput(false);
      setShowVratiZakazivanjaInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
    };

    const handleAddZaposlenogUsluziClick = () =>{
      setShowAddZaposlenogUsluziInput(!showAddZaposlenogUsluziInput);
      setShowAddZaposleniInput(false);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveTermineInput (false);
      setShowVratiSveUslugeInput(false);
      setShowVratiZakazivanjaInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
    };

    const handleDeleteZaposlenogClick = () =>
    {      
      setShowDeleteZaposlenogInput(!showDeleteZaposlenogInput);
      setShowAddZaposlenogUsluziInput(false);
      setShowAddZaposleniInput(false);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveTermineInput (false);
      setShowVratiSveUslugeInput(false);
      setShowVratiZakazivanjaInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
    };

    const handleSpecijalnaPonudaClick = () => {
      setShowSpecijalnePonudeInput(!showSpecijalnePonudeInput);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveTermineInput (false);
      setShowVratiSveUslugeInput(false);
      setShowVratiZakazivanjaInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
    };

    const handleDeleteSpecijalnaPonudaClick = () =>{
      setShowDeleteSpecijalnePonudeInput(!showDeleteSpecijalnePonudeInput);
      setShowSpecijalnePonudeInput(false);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveTermineInput (false);
      setShowVratiSveUslugeInput(false);
      setShowVratiZakazivanjaInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
    };

    const handleVrateSveUslugeClick = () => {
      setShowVratiSveUslugeInput(!showVratiSveUslugeInput);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveTermineInput (false);
      setShowVratiZakazivanjaInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
      fetchUsluge();
    }

    const handleVrateSveZaposleneClick = () => {
      setShowVratiSveZaposleneInput (!showVratiSveZaposleneInput);
      setShowVratiSveUslugeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowVratiSveTermineInput (false);
      setShowVratiZakazivanjaInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
      fetchZaposleni();
    }

    const handleVrateSveTermineClick = () =>
    {
      setShowVratiSveTermineInput (!showVratiSveTermineInput);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveUslugeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowVratiZakazivanjaInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
      fetchTermini();

    } 

    const handleVratiZakazivanja = ()=>
    {
      fetchZakazivanja();
      setShowVratiZakazivanjaInput(!showVratiZakazivanjaInput);
      setShowVratiSveTermineInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveUslugeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
    }

    const handleDeleteZaposlenogIzUslugeClick = () =>{
      setShowDeleteZaposlenogIzUslugeInput(!showDeleteZaposlenogIzUslugeInput);
      setShowVratiSveTermineInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveUslugeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
    }

    const handleVratiSveSpecijalnePonudeClick = () => {
      setShowVratiSveSpecijalnePonudeInput(!showVratiSveSpecijalnePonudeInput);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveTermineInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveUslugeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowVratiSveTermineInput(false);
      setShowVratiZakazivanjaInput(false);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowAdministratora(false);
      fetchSpecijalnePonude();
    }

    const handleVratiZaposleneINjihoveUslugeClick = () => {
      setShowVratiZaposleneINjihoveUslugeInput(!showVratiZaposleneINjihoveUslugeInput);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveTermineInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveUslugeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowVratiSveTermineInput(false);
      setShowVratiZakazivanjaInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowAdministratora(false);
      fetchZaposleniIUsluge();
    }

    const handleAddAdminClick = () =>{
      setShowAdministratora(!showRegistrujAdministratora);
      setShowVratiZaposleneINjihoveUslugeInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
      setShowDeleteZaposlenogIzUslugeInput(false);
      setShowVratiSveTermineInput(false);
      setShowVratiSveZaposleneInput (false);
      setShowVratiSveUslugeInput(false);
      setShowDeleteSpecijalnePonudeInput(false);
      setShowSpecijalnePonudeInput(false);
      setShowAddInput(false);
      setShowDeleteInput(false);
      setShowEditInput(false);
      setShowAddTerminInput(false);
      setShowAddZaposleniInput(false);
      setShowAddZaposlenogUsluziInput(false);
      setShowDeleteZaposlenogInput(false);
      setShowVratiSveTermineInput(false);
      setShowVratiZakazivanjaInput(false);
      setShowVratiSveSpecijalnePonudeInput(false);
    
    }

    const handleObrisiUslugu = () => {
      //console.log(nazivUsluge);
      setShowDeleteInput(true);
      fetch(`https://localhost:7193/Usluga/ObrisiUslugu/${nazivUsluge} `, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${authCtx.token}`
    }
    })
    .then(odgovor=>odgovor.text())
    .then(odgovorText=> {
      window.confirm(odgovorText);
    })
    .catch((error)=>{
      console.log(error);
    });
        setNazivUsluge('');
        setShowAddInput(false);
        setShowEditInput(false);
    };
  

    const handleDodavanjeUsluge = () => {
      fetch("https://localhost:7193/Usluga/DodajUslugu ", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authCtx.token}`
    },
    body:JSON.stringify({
      naziv:nazivUsluge,
      cena:cenaUsluge,
      tip:tipUsluge,
      maxKapacitet:maxKapacitetUsluge,
      duzinaTrajanja:trajanjeUsluge
    }),
    })
    .then(odgovor=>odgovor.text())
    .then(odgovorText=> {
      window.confirm(odgovorText);
    })
    .catch((error)=>{
      console.log(error);
    });
        setNazivUsluge('');
        setTipUsluge('');
        setCenuUsluge('');
        settrajanjeUsluge('');
        setmaxKapacitetUsluge('');
        setShowAddInput(true);
    };

    const handleIzmeniUslugu = () => {
     
      fetch(`https://localhost:7193/Usluga/IzmeniUslugu/${nazivUsluge} `, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authCtx.token}`
      },
      body:JSON.stringify({
        
        naziv:noviNazivUsluge,
        cena:cenaUsluge,
        tip:tipUsluge,
        maxKapacitet:maxKapacitetUsluge,
        duzinaTrajanja:trajanjeUsluge
    }),
    }).then(odgovor=>odgovor.text())
      .then(odgovorText=> {
        window.confirm(odgovorText);
      })
      .catch((error)=>{
        console.log(error);
      });
          setNoviNazivUsluge('');
          setNazivUsluge('');
          setTipUsluge('');
          setCenuUsluge('');
          settrajanjeUsluge('');
          setmaxKapacitetUsluge('');
          setShowEditInput(false);
    };
    //dodavanje termina
    const handleAddTerminConfirm = () => {
      fetch("https://localhost:7193/Termin/DodajTermin ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${authCtx.token}`
    },
      body:JSON.stringify({
        dan:datumTermina,
        sati:vremeTermina,
        zaposleni:usernameZaposlenog,
        nazivUsluge:nazivUsluge
      }),
    }).then(odgovor=>odgovor.text())
      .then(odgovorText=> {
        window.confirm(odgovorText);
    })
      .catch((error)=>{
        console.log(error);
    });
      setDatumTermina('');
      setVremeTermina('');
      setUsernameZaposlenog('');
      setNazivUsluge('');
      setShowAddTerminInput(false);
    };

    const handleAddZaposleniConfirm = () => {
      
      fetch("https://localhost:7193/Zaposleni/RegisterZaposleni ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${authCtx.token}`
      },
      body:JSON.stringify({
        ime:imeZaposlenog,
        prezime:prezimeZaposlenog,
        email:emailZaposlenog,
        username:usernameZaposlenog,
        zanimanje:zanimanjeZaposlenog,
        password:passwordZaposlenog
      }),
    }).then(odgovor=>odgovor.text())
      .then(odgovorText=> {
        window.confirm(odgovorText);
    })
      .catch((error)=>{
        console.log(error);
    });
      setImeZaposlenog('');
      setPrezimeZaposlenog('');
      setZanimanjeZaposlenog('');
      setUsernameZaposlenog('');
      setEmailZaposlenog('');
      setPasswordZaposlenog('');
      setShowAddZaposleniInput(false);
    };

    const handleAddAdminConfirm= ()=>{
      fetch("https://localhost:7193/Korisnik/RegisterAdmin",{
        method:"POST",
        headers:{
          "Content-Type" :"application/json",
          'Authorization': `Bearer ${authCtx.token}`
        },
        body: JSON.stringify({
          username:usernameAdmin,
          password:passwordAdmin,
          email:emailAdmin,
          ime:imeAdmin,
          prezime:prezimeAdmin,
          pol:polAdmin,
          kontakt:kontaktAdmin,
         
        }),
      }).then(async (response) => {
        if (response.ok) {
          window.confirm("Uspesno ste se registrovali! Pogledajte Vas mail da biste potvrdili nalog!");
          setUsernameAdmin('');
          setPasswordAdmin('');
          setImeAdmin('');
          setPrezimeAdmin('');
          setEmailAdmin('');
          setPolAdmin('');
          setKontaktAdmin('');
        } else {
          const responseText = await response.text();
          window.confirm(responseText);
        }
      })
      .catch((error)=>{
        console.log(error);
      });
    }

    const handleAddZaposlenogUsluziConfirm = () => {
      fetch("https://localhost:7193/ZaposleniUsluga/DodajZaposlenogUsluzi/"+usernameZaposlenog+"/"+nazivUsluge , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${authCtx.token}`
      },
    })
      .then(odgovor=>odgovor.text())
      .then(odgovorText=> {
        window.confirm(odgovorText);
      })
      .catch((error)=>{
        console.log(error);
      });
      setUsernameZaposlenog('');
      setNazivUsluge('');
      setShowAddZaposlenogUsluziInput(false);
    };

    const handleDeleteZaposlenogConfirm = () => {
      fetch(`https://localhost:7193/Zaposleni/ObrisiZaposlenog/${usernameZaposlenog} `, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${authCtx.token}`
        }
      })
        .then(odgovor=>odgovor.text())
        .then(odgovorText=> {
          window.confirm(odgovorText);
      })
        .catch((error)=>{
          console.log(error);
      });
        setImeZaposlenog('');
        setShowDeleteZaposlenogInput(false);
      };

    const handleSpecijalnePonudeConfirm = async() => {
      fetch("https://localhost:7193/SpecijalnePonude/OstaviSpecijalnuPonudu/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${authCtx.token}`
        },
        body:JSON.stringify({
          naziv:nazivSpecijalnePonude,
          obavestenje:obavestenjeSpecijalnePonude,
          admin:authCtx.username,
      }),
    }).then(odgovor=>odgovor.text())
      .then(odgovorText=> {
        window.confirm(odgovorText);
    })
      .catch((error)=>{
        window.confirm("Greska prilikom ostavljanja specijalne ponude");
    });

      setNazivSpecijalnePonude('');
      setObavestenjeSpecijalnePonude('');
      setShowSpecijalnePonudeInput(false);
    };

    //brisanje vrsioca iz usluge
    const handleDeleteZaposlenogIzUslugeConfirm = () => {
      fetch(`https://localhost:7193/ZaposleniUsluga/ObrisiZakazivanje/${usernameZaposlenog}/${nazivUsluge} `, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${authCtx.token}`
        }
    })
      .then(odgovor=>odgovor.text())
      .then(odgovorText=> {
        window.confirm(odgovorText);
    })
      .catch((error)=>{
        console.log(error);
    });
      setUsernameZaposlenog('');
      setNazivUsluge('');
      setShowDeleteZaposlenogInput(false);
    };

    const fetchUsluge = async () => {
      try {
         const response = await axios.get('https://localhost:7193/Usluga/VratiUsluge', {
          headers: {
            'Authorization': `Bearer ${authCtx.token}`
          }
        });
         setUsluge(response.data);
       } catch (error) {
         console.error(error);
      }
    }

    const fetchZaposleni = async () => {
      try { //metoda je allowAnonymus
         const response = await axios.get('https://localhost:7193/Zaposleni/VratiZaposlene');
          setZaposleni(response.data);
      }
      catch (error) {
          console.error(error);
      }
    }

    const fetchTermini = async () => {
      try {
        const response = await axios.get('https://localhost:7193/Termin/VratiTermineIUsluge', {
          headers: {
            'Authorization': `Bearer ${authCtx.token}`
          }
        });
        setTermini(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    const fetchSpecijalnePonude = async () => {
      try {
        const response = await fetch('https://localhost:7193/SpecijalnePonude/VratiSpecijalnePonudeAdmin',{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${authCtx.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSpecijalnePonude(data);
      } 
      else {
        console.error('Neuspešan zahtjev:', response.status);
      }
      } 
      catch (error) {
        console.error(error);
      }
    }

    const fetchZakazivanja = async () => {
      try {
        const response = await axios.get('https://localhost:7193/Zakazivanje/VratiZakazivanja', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authCtx.token}`
          }
        });

        if (response.status === 200) {
          const data = response.data;
          setZakazivanja(data);
        } else {
          console.error('Greška prilikom dobijanja podataka');
        }
      } catch (error) {
        console.error(error);
      }
    }

    const fetchZaposleniIUsluge= async ()=>{
      try {
        const response = await axios.get('https://localhost:7193/ZaposleniUsluga/VratiVrsioceIUsluge', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authCtx.token}`
          }
      });

        if (response.status === 200) {
            const data = response.data;
            setZaposleniIUsluge(data);
        } 
        else {
            console.error('Greška prilikom dobijanja podataka');
        }
      } 
      catch (error) {
        console.error(error);
      }
    }
    
    const handleDeleteSpecijalnePonudeConfirm= () => {
      fetch(`https://localhost:7193/SpecijalnePonude/ObrisiPonudu/${nazivSpecijalnePonude} `, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${authCtx.token}`
        }
    })
      .then(odgovor=>odgovor.text())
      .then(odgovorText=> {
        window.confirm(odgovorText);
    })
      .catch((error)=>{
        console.log(error);
    });
      setNazivSpecijalnePonude('');
      setShowDeleteSpecijalnePonudeInput(false);
    };

    return (
      <div className='container-administrator'>
      <div className='prva-polja'>
        <button className='button-administrator' onClick={handleAddClick}>
          Dodaj uslugu
        </button>
        {showAddInput && (
          <div className='dodaj-uslugu'>
          <label>Naziv usluge:</label>
          <input type='text' name='nazivUsluge' value={nazivUsluge}
          onChange={(e) => setNazivUsluge(e.target.value)} />
          
          <label>Cena usluge:</label>
          <input type='number' name='cenaUsluge' value={cenaUsluge}
          onChange={(e) => setCenuUsluge(e.target.value)} />
          <label>Tip usluge:</label>
          <input type='text' name='tipUsluge' value={tipUsluge}
          onChange={(e) => setTipUsluge(e.target.value)}/>
          <label>Maksimalni kapacitet usluge:</label>
          <input type='number' name='maxKapacitetUsluge' value={maxKapacitetUsluge}
          onChange={(e) => setmaxKapacitetUsluge(e.target.value)}/>
          <label>Dužina trajanja usluge (u minutima):</label>
          <input type='number' name='trajanjeUsluge' value={trajanjeUsluge}
          onChange={(e) => settrajanjeUsluge(e.target.value)}/>
          <button onClick={handleDodavanjeUsluge} className='potvrda-dugme'>
            Dodaj
          </button>
        </div>
        )}

        <button className='button-administrator' onClick={handleDeleteClick}>
          Obriši uslugu
        </button>
        {showDeleteInput && (
          <div>
            <label>Ime usluge:</label>
            <input type='text' 
            name='nazivUsluge'
            value={nazivUsluge}
            onChange={(e) => setNazivUsluge(e.target.value)}

            />
            <button onClick={handleObrisiUslugu} className='potvrda-dugme'>
              Obriši
            </button>
          </div>
        )}
        <button className='button-administrator' onClick={handleEditClick}>
          Izmeni uslugu
        </button>
        {showEditInput && (
          <div className='izmeni-uslugu'>
          <label>Naziv usluge:</label>
            <input type='text' name='nazivUsluge' value={nazivUsluge}
            onChange={(e) => setNazivUsluge(e.target.value)} />
            <label>Novi naziv usluge:</label>
          <input type='text' name='noviNazivUsluge' value={noviNazivUsluge}
          onChange={(e) => setNoviNazivUsluge(e.target.value)} />
          
            <label>Cena usluge:</label>
            <input type='number' name='cenaUsluge' value={cenaUsluge}
            onChange={(e) => setCenuUsluge(e.target.value)} />
            <label>Tip usluge:</label>
            <input type='text' name='tipUsluge' value={tipUsluge}
            onChange={(e) => setTipUsluge(e.target.value)}/>
            <label>Maksimalni kapacitet usluge:</label>
            <input type='number' name='maxKapacitetUsluge' value={maxKapacitetUsluge}
            onChange={(e) => setmaxKapacitetUsluge(e.target.value)}/>
            <label>Dužina trajanja usluge (u minutima):</label>
            <input type='number' name='trajanjeUsluge' value={trajanjeUsluge}
            onChange={(e) => settrajanjeUsluge(e.target.value)}/>
            <button onClick={handleIzmeniUslugu} className='potvrda-dugme'>
              Izmeni
              </button>
          </div>
        )}
        <button className='button-administrator' onClick={handleAddTerminClick}>
        Dodaj termin
        </button>
        {showAddTerminInput && (
          <div className='dodaj-termin'>
            <label>Naziv usluge:</label>
            <input type='text' name='nazivUsluge' value={nazivUsluge} onChange={(e) => setNazivUsluge(e.target.value)} />
            <label>Korisnicko ime zaposlenog:</label>
            <input type='text' name='imeZaposlenog' value={usernameZaposlenog} onChange={(e) => setUsernameZaposlenog(e.target.value)} />
            <label>Vreme:</label>
            <input type='time' name='vremeTermina' value={vremeTermina} onChange={(e) => setVremeTermina(e.target.value)} />
            <label>Dan:</label>
            <input type='text' name='datumTermina' value={datumTermina} onChange={(e) => setDatumTermina(e.target.value)} />
            <button onClick={handleAddTerminConfirm} className='potvrda-dugme'>
              Dodaj
            </button>
          </div>
        )}
        <button className='button-administrator' onClick={handleAddZaposlenogUsluziClick}>
          Dodaj zaposlenog usluzi
        </button>

        {showAddZaposlenogUsluziInput && (
          <div className='dodaj-zaposlenog-usluzi'>
            <label>Naziv usluge:</label>
            <input
              type='text'
              name='nazivUsluge'
              value={nazivUsluge}
              onChange={(e) => setNazivUsluge(e.target.value)}
            />
            <label>Korisničko ime zaposlenog:</label>
            <input
              type='text'
              name='imeZaposlenog'
              value={usernameZaposlenog}
              onChange={(e) => setUsernameZaposlenog(e.target.value)}
            />
            <button onClick={handleAddZaposlenogUsluziConfirm} className='potvrda-dugme'>
              Dodaj
            </button>
          </div>
        )}

        <button className='button-administrator' onClick={handleAddZaposleniClick}>
        Registruj novog zaposlenog
        </button>
        {showAddZaposleniInput && (
        <div className='dodaj-zaposlenog'>
          <label>Ime:</label>
          <input
            type='text'
            name='imeZaposlenog'
            value={imeZaposlenog}
            onChange={(e) => setImeZaposlenog(e.target.value)}
            
          />

          <label>Prezime:</label>
          <input
            type='text'
            name='prezimeZaposlenog'
            value={prezimeZaposlenog}
            onChange={(e) => setPrezimeZaposlenog(e.target.value)}
          />
          <label>Email:</label>
          <input
            type='text'
            name='emailZaposlenog'
            value={emailZaposlenog}
            onChange={(e) => setEmailZaposlenog(e.target.value)}
          />
          <label>Zanimanje:</label>
          <input
            type='text'
            name='zanimanjeZaposlenog'
            value={zanimanjeZaposlenog}
            onChange={(e) => setZanimanjeZaposlenog(e.target.value)}
          />
          <label>Korisničko ime:</label>
          <input
            type='text'
            name='usernameZaposlenog'
            value={usernameZaposlenog}
            onChange={(e) => setUsernameZaposlenog(e.target.value)}
          />
          <label>Password:</label>
          <input
            type='password'
            name='passwordZaposlenog'
            value={passwordZaposlenog}
            onChange={(e) => setPasswordZaposlenog(e.target.value)}
          />
          <button onClick={handleAddZaposleniConfirm} className='potvrda-dugme'>
            Dodaj
          </button>
        </div>
        )}
        <button className='button-administrator' onClick={handleDeleteZaposlenogClick}>
              Obriši zaposlenog
        </button>

        {showDeleteZaposlenogInput && (
              <div>
                <label>Korisničko ime zaposlenog:</label>
                <input
                  type='text'
                  name='imeZaposlenog'
                  value={usernameZaposlenog}
                  onChange={(e) => setUsernameZaposlenog(e.target.value)}
                />
          <button onClick={handleDeleteZaposlenogConfirm} className='potvrda-dugme'>
            Obriši
          </button>
          </div>
          )}
          <button className='button-administrator' onClick={handleAddAdminClick}>
        Registruj novog administratora
        </button>
        {showRegistrujAdministratora && (
        <div className='dodaj-admina'>
          <label>
          Ime:
          <input
            type='text'
            name='ime'
            value={imeAdmin}
            onChange={(e) => setImeAdmin(e.target.value)}
          />
        </label>
        <label>
          Prezime:
          <input
            type='text'
            name='prezime'
            value={prezimeAdmin}
            onChange={(e) => setPrezimeAdmin(e.target.value)}
          />
        </label>
        <label>
          Username:
          <input
            type='text'
            name='username'
            value={usernameAdmin}
            onChange={(e) => setUsernameAdmin(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type='text'
            name='email'
            value={emailAdmin}
            onChange={(e) => setEmailAdmin(e.target.value)}
          />
        </label>
        <label>
        Password:
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            value={passwordAdmin}
            onChange={(e) => setPasswordAdmin(e.target.value)}
          />

        </div>
        </label>
        <label>
          Pol:
          <input
            type='text'
            name="pol"
            value={polAdmin}
            onChange={(e) => setPolAdmin(e.target.value)}
          />
        </label>
        <label>
          Broj telefona:
          <input
            type="number"
            name="kontakt"
            value={kontaktAdmin}
            onChange={(e) => setKontaktAdmin(e.target.value)}
          />
        </label>
          <button onClick={handleAddAdminConfirm} className='potvrda-dugme'>
            Dodaj
          </button>
        </div>
        )}
         
    
       </div>
             <div className='vrati-polja'>
             <button className='button-administrator' onClick={handleDeleteZaposlenogIzUslugeClick}>
           Obriši zaposlenog iz usluge
        </button>
        {showDeleteZaposlenogIzUslugeInput && (
          <div>
            <label>Korisnicko ime zaposlenog:</label>
                <input
                  type='text'
                  name='imeZaposlenog'
                  value={usernameZaposlenog}
                  onChange={(e) => setUsernameZaposlenog(e.target.value)}
                />
                 <label>Naziv usluge:</label>
                    <input
                      type='text'
                      name='nazivUsluge'
                      value={nazivUsluge}
                      onChange={(e) => setNazivUsluge(e.target.value)}
                    />
          <button onClick={handleDeleteZaposlenogIzUslugeConfirm} className='potvrda-dugme'>
                Obriši
          </button>
            </div>
            )}

              <button className='button-administrator' onClick={handleSpecijalnaPonudaClick}>
              Okači specijalnu ponudu
            </button>

            {showSpecijalnePonudeInput && (
              <div>
                <label>Naziv specijalne ponude:</label>
                <input
                  type='text'
                  name='nazivSpecijalnePonude'
                  value={nazivSpecijalnePonude}
                  onChange={(e) => setNazivSpecijalnePonude(e.target.value)}
                />
                <label>Obaveštenje:</label>
                <input
                  type='text'
                  name='obavestenjeSpecijalnePonude'
                  value={obavestenjeSpecijalnePonude}
                  onChange={(e) => setObavestenjeSpecijalnePonude(e.target.value)}
                />
                <button onClick={handleSpecijalnePonudeConfirm} className='potvrda-dugme'>
                Okači
               </button>
               </div>
            )}
        <button className='button-administrator' onClick={handleDeleteSpecijalnaPonudaClick}>Obriši specijalnu ponudu</button>
        {showDeleteSpecijalnePonudeInput && (
          <div>
            <label>Naziv specijalne ponude:</label>
                <input
                  type='text'
                  name='nazivSpecijalnePonude'
                  value={nazivSpecijalnePonude}
                  onChange={(e) => setNazivSpecijalnePonude(e.target.value)}
                />
              <button onClick={handleDeleteSpecijalnePonudeConfirm} className='potvrda-dugme'>
              Obriši
             </button>
          </div>
        )}
      
     
        <button className='button-administrator' onClick={handleVrateSveUslugeClick}>Vrati sve usluge</button>
        {showVratiSveUslugeInput && (
          
                  <div>
                    {usluge.length > 0 ? (
                      <table className='vrati-usluge'>
                        <thead>
                          <tr>
                            <th>Naziv usluge</th>
                            <th>Cena usluge</th>
                            <th>Tip usluge</th>
                            <th>Maksimalni kapacitet usluge</th>
                            <th>Dužina trajanja usluge (u minutima)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usluge.map((usluga) => (
                            <tr key={usluga.id}>
                              <td>{usluga.naziv}</td>
                              <td>{usluga.cena}</td>
                              <td>{usluga.tip}</td>
                              <td>{usluga.maxKapacitet}</td>
                              <td>{usluga.duzinaTrajanja}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                        ) : (
                          <p>Nema usluga.</p>
                    )}
                  </div>
        
        )}
        <button className='button-administrator' onClick={handleVrateSveZaposleneClick}>Vrati sve zaposlene</button>
          {showVratiSveZaposleneInput && (
              <div>
                {zaposleni.length > 0 ? (
                  <table className='vrati-zaposlene'>
                    <thead>
                      <tr>
                        <th>Ime zaposlenog</th>
                        <th>Prezime zaposlenog</th>
                        <th>Email</th>
                        <th>Zanimanje</th>
                        <th>Korisničko ime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zaposleni.map((zaposlen) => (
                        <tr key={zaposlen.id}>
                          <td>{zaposlen.ime}</td>
                          <td>{zaposlen.prezime}</td>
                          <td>{zaposlen.email}</td>
                          <td>{zaposlen.zanimanje}</td>
                          <td>{zaposlen.username}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Nema zaposlenih.</p>
                )}
              </div>
            )}

        <button className='button-administrator' onClick={handleVrateSveTermineClick}>Vrati sve termine</button>
        <div>
            {showVratiSveTermineInput && (
              <div>
                {termini.length > 0 ? (
                  <table className='vrati-termine'>
                    <thead>
                      <tr>
                        <th>Naziv usluge</th>
                        <th>Vršilac usluge</th>
                        <th>Dan termina</th>
                        <th>Vreme termina</th>
                      </tr>
                    </thead>
                    <tbody>
                      {termini.map((termin) => (
                        <tr key={termin.id}>
                          <td>{termin.usluga}</td>
                          <td>{termin.zaposleni}</td>
                          <td>{termin.dan}</td>
                          <td>{termin.sati}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Nema termina.</p>
                )}
              </div>
            )}
          </div>

          <button className='button-administrator' onClick={handleVratiZakazivanja}>Vrati zakazivanja</button>
          <div>
            {showVratiZakazivanjaInput && (
              <div>
                {zakazivanja.length > 0 ? (
                  <table className='vrati-zakazivanja'>
                    <thead>
                      <tr>
                        <th>Ime korisnika</th>
                        <th>Prezime korisnika</th>
                        <th>Datum</th>
                        <th>Dan</th>
                        <th>Sati</th>
                        <th>Zaposleni</th>
                        <th>Naziv usluge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zakazivanja.map((z) => (
                        <tr key={z.id}>
                          <td>{z.korisnikIme}</td>
                          <td>{z.korisnikPrezime}</td>
                          <td>{z.datum}</td>
                          <td>{z.dan}</td>
                          <td>{z.sati}</td>
                          <td>{z.zaposleniUsername}</td>
                          <td>{z.nazivUsluge}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Nema zakazivanja.</p>
                )}
              </div>
            )}
          </div>

        <button className='button-administrator' onClick={handleVratiSveSpecijalnePonudeClick}>Vrati sve specijalne ponude</button>
      
        <div>
          {showVratiSveSpecijalnePonudeInput && (
            <div className='vrati-spec-ponude'>
              {specijalnePonude.length > 0 ? (
                <table className='vrati-specijalne-ponude-admin'>
                  <thead>
                    <tr>
                      <th>Naziv specijalne ponude</th>
                      <th>Opis specijalne ponude</th>
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
        </div>

        <button className='button-administrator' onClick={handleVratiZaposleneINjihoveUslugeClick}>Vrati zaposlene i njihove usluge</button>
        <div>
          {showVratiZaposleneINjihoveUslugeInput && (
            <div className='div-vrati-zaposlene-i-usluge'>
              {zaposleniIUsluge.length > 0 ? (
                <table className='vrati-zaposlene-i-usluge'>
                  <thead>
                    <tr>
                      <th>Naziv usluge</th>
                      <th>Ime zaposlenog</th>
                      <th>Prezime zaposlenog</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zaposleniIUsluge.map((zaposlenIUsluge) => (
                      <tr key={zaposlenIUsluge.id}>
                        <td>{zaposlenIUsluge.nazivUsluga}</td>
                        <td>{zaposlenIUsluge.ime}</td>
                        <td>{zaposlenIUsluge.prezime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Nema zaposlenih sa uslugama.</p>
              )}
            </div>
          )}
          </div>

          </div>
          <div className='sesija-admin'>
            {authCtx.sessionTimeLeft && <p>Vasa sesija istice: {minutesLeft}:{secondsLeft < 10 ? '0' : ''}{secondsLeft} min</p>} 
          </div>
        </div>
      );
}
export default Administrator;