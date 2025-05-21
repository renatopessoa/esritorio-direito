import Client from '../models/client.js';
import logger from '../utils/logger.js';

// Criar um novo cliente
export const createClient = async (req, res, next) => {
    try {
        const client = await Client.create(req.body);
        res.status(201).json({
            success: true,
            data: client,
        });
    } catch (error) {
        logger.error('Erro ao criar cliente:', error);
        next(error);
    }
};

// Buscar todos os clientes
export const getAllClients = async (req, res, next) => {
    try {
        const clients = await Client.findAll();
        res.status(200).json({
            success: true,
            count: clients.length,
            data: clients,
        });
    } catch (error) {
        logger.error('Erro ao buscar clientes:', error);
        next(error);
    }
};

// Buscar cliente pelo ID
export const getClientById = async (req, res, next) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado',
            });
        }

        res.status(200).json({
            success: true,
            data: client,
        });
    } catch (error) {
        logger.error('Erro ao buscar cliente:', error);
        next(error);
    }
};

// Atualizar cliente
export const updateClient = async (req, res, next) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado',
            });
        }

        await client.update(req.body);
        res.status(200).json({
            success: true,
            data: client,
        });
    } catch (error) {
        logger.error('Erro ao atualizar cliente:', error);
        next(error);
    }
};

// Deletar cliente
export const deleteClient = async (req, res, next) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado',
            });
        }

        await client.destroy();
        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        logger.error('Erro ao deletar cliente:', error);
        next(error);
    }
};
