import React, { useEffect, useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/pages/Home';
import PrijaviSe from './components/pages/PrijaviSe';
import Recenzije from './components/pages/Recenzije';
import Registracija from './components/pages/Registracija';
import NasTim from './components/pages/NasTim';
import Spa from './components/pages/Spa';
import Zaposleni from './components/pages/Zaposleni';
import Teretana from './components/pages/Teretana';
import Korisnik from './components/pages/Korisnik';
import OstaviRecenziju from './components/pages/OstaviRecenziju';
import ZakaziTermin from './components/pages/ZakaziTermin';
import Administrator from './components/pages/Administrator';
import ZaboravljenaSifra from './components/pages/ZaboravljenaSifra';
import AuthContext, { AuthContextProvider } from './components/auth-context';

function ScrollToTopOnNavigation() { //sluzi da bismo kad predjemo sa jedne na drugu stranicu, vratili na vrh
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  //za sklanjanje navbara na odredjenim stranicama
  const hideNavbarAndFooter = window.location.pathname === '/korisnik' || window.location.pathname === '/zaposleni' || window.location.pathname === '/ostavi-recenziju'|| window.location.pathname === '/zakazi-termin'|| window.location.pathname === '/administrator';
  
  return (
    <AuthContextProvider> 
      {/* //da bi bilo dodstupno na nivou cele stranice */}
    <div className='page-container'>
      <div className='content-wrap'>
        <Router>
          {!hideNavbarAndFooter && <Navbar />}
          <ScrollToTopOnNavigation />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/prijavi-se' element={<PrijaviSe />} />
            <Route path='/recenzije' element={<Recenzije />} />
            <Route path='/registracija' element={<Registracija />} />
            <Route path='/nas-tim' element={<NasTim />} />
            <Route path='/spa' element={<Spa />} />
            <Route path='/teretana' element={<Teretana />} />
            <Route path='/korisnik' element={<Korisnik />} />
            <Route path='/zaposleni' element={<Zaposleni />} />
            <Route path='/ostavi-recenziju' element={<OstaviRecenziju />} />
            <Route path='/zakazi-termin' element={<ZakaziTermin />} />
            <Route path='/administrator' element={<Administrator />} />
            <Route path='/zaboravljena-sifra' element={<ZaboravljenaSifra />} />
          </Routes>
          {!hideNavbarAndFooter && <Footer />}
        </Router>
      </div>
    </div>
    </AuthContextProvider>
  );
}

export default App;
