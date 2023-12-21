import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1 className='sadrzaj-naslov'>Sadržaj Wellness centra</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/img-2.jpg'
              text='
              Dobro došli u našu inovativnu teretanu, gde se fitnes susreće s užitkom i postaje način života! Pridružite nam se i otkrijte revolucionarni pristup vežbanju koji će transformisati vaše telo.'
              label='Teretana'
              path='/teretana'
            />
            <CardItem
              src='images/img-8.jpg'
              text='Kada se umorite od vežbanja, opustite se u našem wellness centru koji nudi razne masaže, saune i tretmane lepote kako biste obnovili svoje telo i duh.'
              label='Spa'
              path='/spa'
            />
          </ul>


        </div>
      </div>
    </div>
  );
}

export default Cards;