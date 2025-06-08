import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Judge = sequelize.define('Judge', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    court: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    courtSection: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile: {
        type: DataTypes.JSONB,
        allowNull: true, // Perfil comportamental baseado em decisões
    },
    statistics: {
        type: DataTypes.JSONB,
        allowNull: true, // Estatísticas de julgamentos
    }
}, {
    timestamps: true,
});

export default Judge;
