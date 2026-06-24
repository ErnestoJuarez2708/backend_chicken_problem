import { describe, it, expect, beforeEach, vi } from "vitest";

import * as statisticsController from "./statisticsController.js";
import * as statisticsService from "../services/statisticsService.js";

vi.mock("../services/statisticsService.js");

describe("Statistics Controller", () => {

    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        vi.clearAllMocks();

        mockReq = {};

        mockRes = {
            success: vi.fn((statusCode, message, data) => ({
                statusCode,
                message,
                data
            }))
        };

        mockNext = vi.fn();
    });

    describe("getPriceStatistics", () => {

        it("should return price statistics", async () => {

            const mockStatistics = {
                averagePrice: 18.5,
                minPrice: 15,
                maxPrice: 22,
                totalRecords: 10
            };

            statisticsService.getPriceStatisticsService
                .mockResolvedValue(mockStatistics);

            await statisticsController.getPriceStatistics(
                mockReq,
                mockRes,
                mockNext
            );

            expect(mockRes.success).toHaveBeenCalledWith(
                200,
                "Price statistics successfully generated",
                mockStatistics
            );
        });

        it("should call next when service throws an error", async () => {

            const error = new Error("Database error");

            statisticsService.getPriceStatisticsService
                .mockRejectedValue(error);

            await statisticsController.getPriceStatistics(
                mockReq,
                mockRes,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe("getAvailabilityStatistics", () => {

        it("should return availability statistics", async () => {

            const mockStatistics = {
                totalPoints: 20,
                availablePoints: 15,
                outOfStockPoints: 5,
                availabilityPercentage: 75
            };

            statisticsService.getAvailabilityStatisticsService
                .mockResolvedValue(mockStatistics);

            await statisticsController.getAvailabilityStatistics(
                mockReq,
                mockRes,
                mockNext
            );

            expect(mockRes.success).toHaveBeenCalledWith(
                200,
                "Availibity statistics successfully generated",
                mockStatistics
            );
        });

        it("should call next when service throws an error", async () => {

            const error = new Error("Database error");

            statisticsService.getAvailabilityStatisticsService
                .mockRejectedValue(error);

            await statisticsController.getAvailabilityStatistics(
                mockReq,
                mockRes,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});