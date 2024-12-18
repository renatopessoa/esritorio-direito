import React from 'react';
import { BackgroundPattern } from './BackgroundPattern';
import { HeroContent } from './HeroContent';

export function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      <BackgroundPattern />
      <div className="relative container mx-auto px-4 py-32">
        <HeroContent />
      </div>
    </div>
  );
}