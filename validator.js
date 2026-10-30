const { z } = require('zod');

// Define a strict schema to prevent NoSQL injection or mass assignment
const contactSubmissionSchema = z.object({
    fullName: z.string().min(2, "Name is too short").max(100),
    email: z.string().email("Invalid email format"),
    company: z.string().max(150).optional(),
    message: z.string().min(10).max(1000)
}).strict();

// Reusable validation middleware
const validatePayload = (schema) => (req, res, next) => {
    try {
        // Parse and sanitize the incoming JSON payload
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid request payload",
            errors: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
    }
};

module.exports = { validatePayload, contactSubmissionSchema };
