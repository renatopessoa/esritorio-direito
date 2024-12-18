import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agenda</h1>
        <div className="flex items-center space-x-4">
          <button className="bg-gray-100 p-2 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium">Março 2024</span>
          <button className="bg-gray-100 p-2 rounded-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="text-center font-medium text-gray-600">
            {day}
          </div>
        ))}
        {/* Células do calendário aqui */}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Compromissos do Dia</h2>
        <div className="space-y-4">
          {/* Lista de compromissos aqui */}
        </div>
      </div>
    </div>
  );
}