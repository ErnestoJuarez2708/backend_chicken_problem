import { describe, it, expect, beforeEach, vi } from "vitest";

import {
    errorHandler,
    responseFormatter
} from "./formatingMiddleware.js";

describe("Formatting Middleware", () => {

    let req;
    let res;
    let next;

    beforeEach(() => {

        req = {};

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        next = vi.fn();
    });

    describe("responseFormatter", () => {

        it("should add success function to response object", () => {

            responseFormatter(req, res, next);

            expect(res.success).toBeDefined();
            expect(typeof res.success).toBe("function");

            expect(next).toHaveBeenCalled();
        });

        it("should format successful response", () => {

            responseFormatter(req, res, next);

            res.success(
                200,
                "Operation successful",
                { id: "123" }
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Operation successful",
                data: { id: "123" }
            });
        });

        it("should use null as default data", () => {

            responseFormatter(req, res, next);

            res.success(
                200,
                "Operation successful"
            );

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Operation successful",
                data: null
            });
        });
    });

    describe("errorHandler", () => {

        it("should return provided error information", () => {

            const error = new Error("Validation failed");
            error.statusCode = 400;

            errorHandler(error, req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Validation failed",
                errors: null
            });
        });

        it("should return default 500 error", () => {

            const error = {};

            errorHandler(error, req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Internal server error",
                errors: null
            });
        });

        it("should include validation errors", () => {

            const error = new Error("Validation failed");

            error.statusCode = 400;

            error.errors = [
                "name is required",
                "email is invalid"
            ];

            errorHandler(error, req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Validation failed",
                errors: [
                    "name is required",
                    "email is invalid"
                ]
            });
        });
    });
});