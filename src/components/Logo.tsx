
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link to="/" className={`text-2xl font-bold text-gradient ${className}`}>
      SpiritTrack
    </Link>
  );
};

export default Logo;
