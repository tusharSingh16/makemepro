import Image from 'next/image';
import React from 'react';

interface PillProps {
  text: string;
  color?: string;
  icon?: string;
}

const Pill = ({ text, icon, color }: PillProps) => {
  return (
    <span className={`inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white rounded-full ${color}`}>
      {icon &&
      <Image src={icon} alt="image" className="pr-0.5" width={24} height={24} />}
      <h1 className="regular-8">
        {text}
      </h1>
    </span>
  );
};

export default Pill;
