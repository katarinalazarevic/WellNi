import '../../App.css';
import '../Recenzija.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Recenzije = () => {
  const [recenzije, setRecenzije] = useState([]);

  useEffect(() => {
    fetchRecenzije();
  }, []);

  const fetchRecenzije = async () => {
    try {
      const response = await axios.get('https://localhost:7193/Recenzije/VratiSveRecenzije');
      setRecenzije(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sortRecenzijeByOcena = () => {
    const sortedRecenzije = [...recenzije].sort((a, b) => b.ocena - a.ocena);
    setRecenzije(sortedRecenzije);
  };

  const sortRecenzijeByDatum = () => {
    const sortedRecenzije = [...recenzije].sort((a, b) => new Date(b.datum) - new Date(a.datum));
    setRecenzije(sortedRecenzije);
  };
  
  //deo za grafik
  const getPieChartData = () => {
    const ocene = [0, 0, 0, 0, 0]; // Niz za čuvanje broja ocena za svaku ocenu
  
    recenzije.forEach((recenzija) => {
      const ocena = recenzija.ocena;
      if (ocena >= 1 && ocena <= 5) {
        ocene[ocena - 1]++; // Povećaj broj za odgovarajuću ocenu
      }
    });
  
    const pieData = {
      labels: ['1', '2', '3', '4', '5'], // Oznake ocena
      datasets: [
        {
          data: ocene,
          backgroundColor: ['#4BC0C0', '#FF9F40', '#FFCD56', '#FF6384', '#36A2EB'], // Boje za svaku ocenu
        },
      ],
    };
  
    return pieData;
  };
  

  return (
    <div className='container-recenzije'>
      <h1 className='naslov-recenzije'>Recenzije</h1>
      <div className='dugmici'>
        <button className='button-recenzije' onClick={sortRecenzijeByOcena}>
          Sortiraj po oceni
        </button>
        <button className='button-recenzije' onClick={sortRecenzijeByDatum}>
          Sortiraj po datumu
        </button>
      </div>
      <div className='recenzije-div'>
        {recenzije.length > 0 ? (
          <>
         <div className='pie-chart'>
          <Pie data={getPieChartData()} />
        </div>

            {recenzije.map((recenzija) => (
              <div className='recenzija' key={recenzija.id}>
                <div>
                  <label>Za: </label>
                  <strong>{recenzija.za}</strong>
                </div>
                <div>
                  <label>Ocena:</label> {recenzija.ocena}
                </div>
                <div>
                  <label>Komentar:</label> {recenzija.komentar}
                </div>
                <div>
                  <label>Datum: </label> {recenzija.datum}
                </div>
                <div>
                  <label>Korisnik: </label> {recenzija.korisnik}
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>Nema recenzija.</p>
        )}
      </div>
    </div>
  );
};

export default Recenzije;
