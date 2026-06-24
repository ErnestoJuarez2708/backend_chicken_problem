import { Inventory } from "../data/inventory.js";

export const getPriceStatisticsService = async () => {
    try {
        const stats = await Inventory.aggregate([
            {
                $group: {
                    _id: null,
                    averagePrice: { $avg: "$precioPorKg" },
                    minPrice: { $min: "$precioPorKg" },
                    maxPrice: { $max: "$precioPorKg" },
                    totalRecords: { $sum: 1 }
                }
            }
        ]);

        return stats[0] || {
            averagePrice: 0,
            minPrice: 0,
            maxPrice: 0,
            totalRecords: 0
        };
    } catch (error) {
        throw new Error("Error getting price statistics: " + error.message);
    }
};

export const getAvailabilityStatisticsService = async () => {
    try {
        const stats = await Inventory.aggregate([
            {
                $group: {
                    _id: null,
                    totalPoints: { $sum: 1 },
                    availablePoints: {
                        $sum: {
                            $cond: [
                                { $gt: ["$cantidadDisponible", 0] },
                                1,
                                0
                            ]
                        }
                    },
                    outOfStockPoints: {
                        $sum: {
                            $cond: [
                                { $eq: ["$cantidadDisponible", 0] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const result = stats[0] || {
            totalPoints: 0,
            availablePoints: 0,
            outOfStockPoints: 0
        };

        return {
            ...result,
            availabilityPercentage:
                result.totalPoints > 0
                    ? Number(
                        (
                            (result.availablePoints / result.totalPoints) *
                            100
                        ).toFixed(2)
                    )
                    : 0
        };
    } catch (error) {
        throw new Error("Error getting availability statistics: " + error.message);
    }
};