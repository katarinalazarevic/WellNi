import React, {useState, useEffect} from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './NavBar.css';
import { Button } from './Button';
import './Footer';
import { Link as ScrollLink } from "react-scroll";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';


function Navbar() {
    const location = useLocation();
    const [click, setClick] = useState(false);
    const [button,setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const [scrollPosition, setScrollPosition] = useState(0);


    const hideNavbar = location.pathname === '/korisnik' || location.pathname === '/zaposleni' || location.pathname === '/ostavi-recenziju'|| location.pathname === '/zakazi-termin'|| location.pathname === '/administrator';

    const showButton = () => {
      if (window.innerWidth <= 960) {
        setButton(false);
      } else {
        setButton(true);
      }
    };
    

    useEffect(() => {
      const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
      };

      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
    const scrollTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    useEffect(() => {
      showButton();
      window.addEventListener('resize', showButton);

      return () => {
        window.removeEventListener('resize', showButton);
      };
    }, []);

    if (hideNavbar) {
      return null;
    }



  return (
    <>
        <nav className="navbar">
            <div className="navbar-container">
            <RouterLink to='/' className='navbar-logo' onClick={() => { closeMobileMenu(); scrollTop(); }}>
            TRESOFT
            <FontAwesomeIcon className='logo-gym' icon={faDumbbell} />

          </RouterLink>
                 

        
          <div className='menu-icon' onClick={handleClick}>
            <i className={click? 'fas fa-times' : 'fas fa-bars'} />
                 </div>
                 <ul className={click? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                      <RouterLink to='/' className='nav-links' onClick={() => { closeMobileMenu(); scrollTop(); }}>
                        Početna strana
                      </RouterLink>
                    </li>
                    <li className='nav-item'>
                      <RouterLink to='/teretana' className='nav-links' onClick={() => { closeMobileMenu(); scrollTop(); }}>
                        Teretana
                      </RouterLink>
                    </li>
                    <li className='nav-item'>
                      <RouterLink to='/spa' className='nav-links' onClick={() => { closeMobileMenu(); scrollTop(); }}>
                        Spa 
                      </RouterLink>
                    </li>
                    <li className='nav-item'>
                      <RouterLink to='/recenzije' className='nav-links' onClick={() => { closeMobileMenu(); scrollTop(); }}>
                        Recenzije
                      </RouterLink>
                    </li>
                    <li className='nav-item'>
                    <ScrollLink to='footer' smooth={true} duration={500} className='nav-links' onClick={closeMobileMenu}>
                              Kontakt
                    </ScrollLink>
                    </li>
                    <li className='nav-item'>
                      <RouterLink to='/nas-tim' className='nav-links' onClick={() => { closeMobileMenu(); scrollTop(); }}>
                        Naš tim 
                      </RouterLink>
                    </li>
                    <li className='nav-item'>
                      <RouterLink to='/prijavi-se' className='nav-links-mobile' onClick={() => { closeMobileMenu(); scrollTop(); }}>
                        Prijavi se
                      </RouterLink>
                    </li>
                 </ul>
                 {button && < Button buttonStyle='btn--outline'>PRIJAVI SE</Button>} 
            </div>
        </nav>
    </>
  )
}

export default Navbar;