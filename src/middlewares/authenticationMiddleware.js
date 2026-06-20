import jwt from "jsonwebtoken";

export function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = Error("Authorization token missing");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    error.statusCode = 401;
    error.message = "Invalid or expired token";
    return next(error);
  }
}

export function authorizationMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      const error = Error("User not authenticated");
      error.statusCode = 401;
      return next(error);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      const error = Error("Insufficient permissions for this action");
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
}
