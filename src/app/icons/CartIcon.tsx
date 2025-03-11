// components/CartIcon.tsx
import React from 'react';

interface CartIconProps {
  count: number;
}

const CartIcon: React.FC<CartIconProps> = ({ count }) => (
  <div className="relative hidden sm:block">
    {/* Cart Icon */}
    <svg width="40" height="40" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="72" height="72" fill="transparent"/>
      <path d="M22.5 29H74L69.5 55H30.5L22.5 29Z" fill="#eab308" />
      <circle cx="34.5" cy="67.5" r="5.5" fill="#eab308" />
      <circle cx="63.5" cy="67.5" r="5.5" fill="#eab308" />
      <path d="M26.5 25H22L27 60H72.5" stroke="#eab308" strokeWidth="2" />
    </svg>

    {/* Item Count Badge */}
    {count > 0 && (
      <span className="absolute -top-0 -right-0 bg-blue-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {count}
      </span>
    )}
  </div>
);

export default CartIcon;
