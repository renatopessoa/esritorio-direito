import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Client = sequelize.define('Client', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    document: {
        type: DataTypes.STRING, // CPF ou CNPJ
        allowNull: false,
        unique: true,
    },
    type: {
        type: DataTypes.ENUM('pessoa_fisica', 'pessoa_juridica'),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true,
            isValidDate(value) {
                if (value && isNaN(Date.parse(value))) {
                    throw new Error('Data de nascimento inválida');
                }
            }
        },
        get() {
            return this.getDataValue('birthDate');
        },
        set(value) {
            if (value === '' || value === null || value === undefined) {
                this.setDataValue('birthDate', null);
            } else {
                this.setDataValue('birthDate', value);
            }
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default Client;
