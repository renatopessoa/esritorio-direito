import React from 'react';
import { useNavigate } from 'react-router-dom';
// TODO: Implementar caseService quando estiver disponível
// import { CaseForm } from '../../components/cases/CaseForm';

export const NewCasePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Novo Caso</h1>
            <div className="text-center py-8 text-gray-400">
                Funcionalidade será implementada em breve
            </div>
            <button
                onClick={() => navigate('/cases')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Voltar para Lista de Casos
            </button>
        </div>
    );
};
