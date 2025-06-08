import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const JurimetryCase = sequelize.define('JurimetryCase', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Clients',
            key: 'id'
        }
    },
    caseType: {
        type: DataTypes.STRING,
        allowNull: false, // Ex: "trabalhista", "civil", "criminal"
    },
    legalThesis: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    court: {
        type: DataTypes.STRING,
        allowNull: true, // Comarca
    },
    courtSection: {
        type: DataTypes.STRING,
        allowNull: true, // Vara
    },
    judgeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Judges',
            key: 'id'
        }
    },
    predictedSuccessRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true, // Percentual de sucesso
    },
    predictedDuration: {
        type: DataTypes.INTEGER,
        allowNull: true, // Duração em dias
    },
    predictedValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true, // Valor médio de condenação
    },
    suggestedSettlementRange: {
        type: DataTypes.JSONB,
        allowNull: true, // { min: valor, max: valor, idealTiming: dias }
    },
    analysisData: {
        type: DataTypes.JSONB,
        allowNull: true, // Dados completos da análise
    },
    status: {
        type: DataTypes.ENUM('analyzing', 'completed', 'error'),
        defaultValue: 'analyzing',
    }
}, {
    timestamps: true,
});

export default JurimetryCase;
