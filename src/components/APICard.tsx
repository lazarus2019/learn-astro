import type { Car } from '@/content/type';
import { useState } from 'react';

type CollectionEntry = {
  id: string;
  collection: 'product';
  data: Car;
};

export const APICard = () => {
  const [cars, setCars] = useState<CollectionEntry[]>([]);

  const handleClick = async () => {
    const res = await fetch('/endpoint.json');
    const data = await res.json();

    console.log(data);

    setCars(data);
  };

  return (
    <div>
      <p>Get more items</p>
      {cars.map((car) => (
        <p key={car.id}>{car.data.name}</p>
      ))}

      <button onClick={handleClick}>Get items</button>
    </div>
  );
};
