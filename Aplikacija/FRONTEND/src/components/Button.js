import React from 'react';
import './Button.css'
import { Link } from 'react-router-dom';

const STYLES = ['btn--primary, btn--outline'];
 //kako da izgleda pozadina dugmeta
 const SIZES = ['btn--medium', 'btn--large'];

export const Button = ({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize
  }) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) 
    ? buttonStyle 
    : STYLES[0]; //ako nista nije navedeno bice primary, kao iz niza gore
    
    const checkButtonSize= SIZES.includes(buttonSize)
    ? buttonSize
    : SIZES[0];

    return (
      <Link to='/prijavi-se' className='btn-mobile'>
         <button
        className={`btn ${checkButtonStyle} ${checkButtonSize}`}
        onClick={onClick}
        type={type}
      >
          {children}
        </button>
      </Link>
    )
  };
