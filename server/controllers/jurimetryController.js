import JurimetryCase from '../models/jurimetryCase.js';
import jurimetryService from '../services/jurimetryService.js';

export const analyzeCase = async (req, res) => {
    try {
        const analysis = await jurimetryService.analyzeCasePrediction(req.body);
        
        const jurimetryCase = await JurimetryCase.create({
            ...req.body,
            predictedSuccessRate: analysis.successRate,
            predictedDuration: analysis.averageDuration,
            predictedValue: analysis.averageValue,
            suggestedSettlementRange: analysis.settlementSuggestion,
            analysisData: analysis.analysisData,
            status: 'completed'
        });

        res.json({
            caseId: jurimetryCase.id,
            analysis
        });
    } catch (error) {
        console.error('Error analyzing case:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getCaseAnalysis = async (req, res) => {
    try {
        const jurimetryCase = await JurimetryCase.findByPk(req.params.id);
        
        if (!jurimetryCase) {
            return res.status(404).json({ error: 'Análise não encontrada' });
        }

        res.json(jurimetryCase);
    } catch (error) {
        console.error('Error fetching case analysis:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getClientAnalyses = async (req, res) => {
    try {
        const analyses = await JurimetryCase.findAll({
            where: { clientId: req.params.clientId },
            order: [['createdAt', 'DESC']]
        });

        res.json(analyses);
    } catch (error) {
        console.error('Error fetching client analyses:', error);
        res.status(500).json({ error: error.message });
    }
};
