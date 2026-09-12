export const internalServiceAuth = (req, res, next) => {
  try {
    const secret = req.headers["x-internal-service-secret"];

    if (!secret) {
      return res.status(403).json({
        success: false,
        message: "Internal service secret is missing",
      });
    }

    if (secret !== process.env.INTERNAL_SERVICE_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized internal request",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal authentication failed",
    });
  }
};