import JurimetryCase from '../models/jurimetryCase.js';
import Judge from '../models/judge.js';
import axios from 'axios';

class JurimetryService {
    constructor() {
        this.apiKey = process.env.JURIMETRY_API_KEY;
        this.baseURL = process.env.JURIMETRY_API_URL || 'https://api.jurimetria.com.br';
    }

    async analyzeCasePrediction(caseData) {
        try {
            const { legalThesis, caseType, court, courtSection, judgeId } = caseData;
            
            // 1. Buscar dados do juiz se especificado
            let judgeProfile = null;
            if (judgeId) {
                const judge = await Judge.findByPk(judgeId);
                judgeProfile = judge?.profile;
            }

            // 2. Consultar API de jurimetria para casos similares
            const similarCases = await this.fetchSimilarCases({
                thesis: legalThesis,
                type: caseType,
                court,
                courtSection,
                judgeId
            });

            // 3. Calcular métricas preditivas
            const prediction = this.calculatePredictions(similarCases, judgeProfile);

            // 4. Gerar sugestões de acordo
            const settlementSuggestion = this.generateSettlementSuggestion(
                prediction, 
                judgeProfile, 
                similarCases
            );

            return {
                successRate: prediction.successRate,
                averageDuration: prediction.averageDuration,
                averageValue: prediction.averageValue,
                settlementSuggestion,
                analysisData: {
                    similarCasesCount: similarCases.length,
                    dataQuality: this.assessDataQuality(similarCases),
                    confidenceLevel: prediction.confidenceLevel
                }
            };

        } catch (error) {
            console.error('Error in jurimetry analysis:', error);
            throw new Error('Falha na análise jurimetrica');
        }
    }

    async fetchSimilarCases(criteria) {
        try {
            const response = await axios.post(`${this.baseURL}/cases/similar`, {
                ...criteria,
                limit: 1000
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.cases || [];
        } catch (error) {
            console.error('Error fetching similar cases:', error);
            return [];
        }
    }

    calculatePredictions(cases, judgeProfile) {
        if (!cases.length) {
            return {
                successRate: 50, // Default quando não há dados
                averageDuration: 365,
                averageValue: 0,
                confidenceLevel: 'low'
            };
        }

        const successfulCases = cases.filter(c => c.outcome === 'favorable');
        const successRate = (successfulCases.length / cases.length) * 100;

        const durations = cases.map(c => c.durationDays).filter(d => d > 0);
        const averageDuration = durations.length ? 
            durations.reduce((a, b) => a + b, 0) / durations.length : 365;

        const values = cases.map(c => c.compensationValue).filter(v => v > 0);
        const averageValue = values.length ? 
            values.reduce((a, b) => a + b, 0) / values.length : 0;

        // Ajustar com base no perfil do juiz
        let adjustedSuccessRate = successRate;
        if (judgeProfile?.tendencies) {
            adjustedSuccessRate *= judgeProfile.tendencies.favorabilityMultiplier || 1;
        }

        const confidenceLevel = this.calculateConfidenceLevel(cases.length, judgeProfile);

        return {
            successRate: Math.min(Math.max(adjustedSuccessRate, 0), 100),
            averageDuration: Math.round(averageDuration),
            averageValue: Math.round(averageValue),
            confidenceLevel
        };
    }

    generateSettlementSuggestion(prediction, judgeProfile, cases) {
        const baseValue = prediction.averageValue;
        
        // Calcular faixa de acordo baseada em histórico
        let minSettlement = baseValue * 0.6; // 60% do valor médio
        let maxSettlement = baseValue * 0.8; // 80% do valor médio
        
        // Ajustar com base no perfil do juiz
        if (judgeProfile?.settlementTendency) {
            const tendency = judgeProfile.settlementTendency;
            minSettlement *= tendency.multiplier || 1;
            maxSettlement *= tendency.multiplier || 1;
        }

        // Sugerir timing ideal (geralmente antes de audiência ou sentença)
        const idealTiming = this.calculateIdealSettlementTiming(prediction.averageDuration, judgeProfile);

        return {
            recommendedRange: {
                min: Math.round(minSettlement),
                max: Math.round(maxSettlement)
            },
            idealTiming,
            reasoning: this.generateSettlementReasoning(prediction, judgeProfile),
            probability: this.calculateSettlementProbability(prediction, judgeProfile)
        };
    }

    calculateIdealSettlementTiming(averageDuration, judgeProfile) {
        // Timing padrão: 30% do tempo médio de duração
        let idealDays = Math.round(averageDuration * 0.3);
        
        if (judgeProfile?.settlementTiming) {
            idealDays = judgeProfile.settlementTiming.preferredDays || idealDays;
        }

        return Math.max(idealDays, 30); // Mínimo 30 dias
    }

    generateSettlementReasoning(prediction, judgeProfile) {
        const reasons = [];
        
        if (prediction.successRate < 60) {
            reasons.push('Taxa de sucesso moderada favorece acordo');
        }
        
        if (prediction.averageDuration > 730) {
            reasons.push('Duração longa do processo torna acordo vantajoso');
        }

        if (judgeProfile?.settlementFriendly) {
            reasons.push('Magistrado tem histórico favorável a acordos');
        }

        return reasons.join('; ');
    }

    calculateSettlementProbability(prediction, judgeProfile) {
        let probability = 50; // Base
        
        if (prediction.successRate < 70) probability += 20;
        if (prediction.averageDuration > 365) probability += 15;
        if (judgeProfile?.settlementFriendly) probability += 25;
        
        return Math.min(probability, 95);
    }

    assessDataQuality(cases) {
        if (cases.length >= 100) return 'high';
        if (cases.length >= 30) return 'medium';
        return 'low';
    }

    calculateConfidenceLevel(casesCount, judgeProfile) {
        if (casesCount >= 100 && judgeProfile) return 'high';
        if (casesCount >= 50) return 'medium';
        return 'low';
    }
}

export default new JurimetryService();
