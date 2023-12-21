import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container'>
      <image src='/images/img-5.jpg' />
      <h1>WellNi</h1>
      <p>- Wellness centar -</p>
      <p> Your only limit is your mind </p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          PRIJAVI SE
        </Button>

      </div>
    </div>
  );
}

export default HeroSection;