import React from 'react';

function PlayerCard({ name, position, year, trait }) {
  return (
    <div>
      <p>{name} - {position} - {year} - {trait}</p>
    </div>
  );
}

export default PlayerCard;
