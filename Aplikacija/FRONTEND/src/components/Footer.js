import React from 'react';
import './Footer.css';
import { useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const hideFooter = location.pathname === '/korisnik' || location.pathname === '/zaposleni' || location.pathname === '/ostavi-recenziju' || location.pathname === '/zakazi-termin' || location.pathname === '/administrator';

  if (hideFooter) {

    return null;
  }

  return (

    <div className='main-footer'>
            <div id="footer" className='container-kontakt'>
                <h1>Kontakt WellNi centra</h1>
                <div className='row'>
                    {/*Column 1*/}
                    <div className='col1'>
                        <h4>Lokacija</h4>
                        <h4 className='list-unstyled'></h4>
                            <li className='li-futer'>ul. 21 Maj 1, Niš, Srbija</li>
                        <h4>Broj telefona</h4>
                            <li className='li-futer'>+ 381 63 549 999</li>
                            <li className='li-futer'>+ 381 63 785 989</li>
                    </div>

                    {/*Column 2*/}
                    <div className='col2'>
                    <h4>E-mail</h4>
                            <li className='li-futer'>wellni@gmail.com</li>
                        <h4>Socijalne Mreže</h4>
                        <ul className='list-unstyled'>
                            <li className='li-futer'>Instagram:  @wellni</li>
                            <li className='li-futer'>Facebook: WellNi centar</li>
                        </ul>
                    </div>  
                 </div>
                 <hr/>
                 <div className='row'>
                    <p className='col-sm'>
                        &copy;{new Date().getFullYear()} | All right reserved | Terms Of Service | Privacy
                    </p>
                 </div>
            </div>

    </div>
    
  );
}

export default Footer;
