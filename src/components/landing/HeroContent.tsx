import React from 'react';
import { Scale } from 'lucide-react';
import { branding } from '../../config/branding';
import { FeaturesGrid } from './FeaturesGrid';

export function HeroContent() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Logo */}
      <div className="mb-8">
        <Scale className="w-20 h-20 mx-auto text-blue-400" />
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {branding.name}
      </h1>
      
      {/* Subtitle */}
      <p className="text-xl md:text-2xl text-gray-300 mb-12">
        Sistema Integrado de Gestão Jurídica
      </p>

      {/* Features Grid */}
      <div id="features">
        <FeaturesGrid />
      </div>
    </div>
  );
}