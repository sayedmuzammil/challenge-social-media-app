import Image from 'next/image';
import React from 'react';
import defaultImage from '../../../public/images/default-image.png';

const Gallery = () => {
  return (
    <div className="grid grid-cols-3 gap-2 ">
      <Image
        src={defaultImage}
        alt="Logo"
        width={268}
        height={268}
        className="w-full rounded-2xl"
      />
      <Image
        src={defaultImage}
        alt="Logo"
        width={268}
        height={268}
        className="w-full rounded-2xl"
      />
      <Image
        src={defaultImage}
        alt="Logo"
        width={268}
        height={268}
        className="w-full rounded-2xl"
      />
      <Image
        src={defaultImage}
        alt="Logo"
        width={268}
        height={268}
        className="w-full rounded-2xl"
      />
    </div>
  );
};

export default Gallery;
