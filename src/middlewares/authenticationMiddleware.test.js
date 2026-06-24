import { describe, it, expect, beforeEach, vi } from "vitest";
import jwt from "jsonwebtoken";

import {
    authenticationMiddleware,
    authorizationMiddleware
} from "./authenticationMiddleware.js";

vi.mock("jsonwebtoken");

describe("Authentication Middleware", () => {

    let req;
    let res;
    let next;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            headers: {}
        };

        res = {};

        next = vi.fn();
    });

    describe("authenticationMiddleware", () => {

        it("should authenticate valid token", () => {

            const decodedUser = {
                id: "123",
                role: "ADMIN"
            };

            req.headers.authorization = "Bearer valid-token";

            jwt.verify.mockReturnValue(decodedUser);

            authenticationMiddleware(req, res, next);

            expect(jwt.verify).toHaveBeenCalled();

            expect(req.user).toEqual(decodedUser);

            expect(next).toHaveBeenCalledWith();
        });

        it("should return error when authorization header is missing", () => {

            authenticationMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();

            const error = next.mock.calls[0][0];

            expect(error.message).toBe("Authorization token missing");
            expect(error.statusCode).toBe(401);
        });

        it("should return error when authorization header does not start with Bearer", () => {

            req.headers.authorization = "Basic token";

            authenticationMiddleware(req, res, next);

            const error = next.mock.calls[0][0];

            expect(error.message).toBe("Authorization token missing");
            expect(error.statusCode).toBe(401);
        });

        it("should return error when token is invalid", () => {

            req.headers.authorization = "Bearer invalid-token";

            jwt.verify.mockImplementation(() => {
                throw new Error("jwt malformed");
            });

            authenticationMiddleware(req, res, next);

            const error = next.mock.calls[0][0];

            expect(error.message).toBe("Invalid or expired token");
            expect(error.statusCode).toBe(401);
        });
    });

    describe("authorizationMiddleware", () => {

        it("should allow access when user has required role", () => {

            req.user = {
                id: "123",
                role: "ADMIN"
            };

            const middleware =
                authorizationMiddleware(["ADMIN"]);

            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        it("should allow access when allowedRoles is empty", () => {

            req.user = {
                id: "123",
                role: "CONSUMER"
            };

            const middleware =
                authorizationMiddleware([]);

            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        it("should return 401 when user is not authenticated", () => {

            const middleware =
                authorizationMiddleware(["ADMIN"]);

            middleware(req, res, next);

            const error = next.mock.calls[0][0];

            expect(error.message).toBe("User not authenticated");
            expect(error.statusCode).toBe(401);
        });

        it("should return 403 when user role is not allowed", () => {

            req.user = {
                id: "123",
                role: "SELLER"
            };

            const middleware =
                authorizationMiddleware(["ADMIN"]);

            middleware(req, res, next);

            const error = next.mock.calls[0][0];

            expect(error.message).toBe(
                "Insufficient permissions for this action"
            );

            expect(error.statusCode).toBe(403);
        });
    });
});