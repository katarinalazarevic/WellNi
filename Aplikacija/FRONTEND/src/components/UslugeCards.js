import React, { useState } from 'react';
import './StyledCard.css';


export default function UslugeCards({ item: { id, title, body, image } }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`usluge-cards ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>

      <div>
        <img src={`./images/${image}`} alt='' />
      </div>
    </div>
  );
}
