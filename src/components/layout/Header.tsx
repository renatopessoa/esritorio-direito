import React from 'react';
import { branding } from '../../config/branding';

export function Header() {
  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold bg-gradient-to-r ${branding.primaryColor} bg-clip-text text-transparent`}>
        {branding.name}
      </h1>
    </div>
  );
}