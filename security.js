const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// 1. Apply robust security headers to all incoming requests
const applySecurityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
});

// 2. Prevent abuse on public endpoints (e.g., Contact Forms, Demo Scheduling)
const publicEndpointLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window
    message: {
        success: false,
        error: "Too many requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { applySecurityHeaders, publicEndpointLimiter };
