import {
    getPriceStatisticsService,
    getAvailabilityStatisticsService
} from "../services/statistics.service.js";

export const getPriceStatistics = async (req, res, next) => {
    try {
        const statistics = await getPriceStatisticsService();
        res.success(200, "Price statistics successfully generated", statistics)
    } catch (error) {
        next(error);
    }
};

export const getAvailabilityStatistics = async (req, res, next) => {
    try {
        const statistics = await getAvailabilityStatisticsService();
        res.success(200, "Availibity statistics successfully generated", statistics)
    } catch (error) {
        next(error);
    }
};