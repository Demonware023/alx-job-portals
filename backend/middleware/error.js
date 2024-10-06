// backend/middleware/error.js

const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging

    // Set default error status and message
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';

    // Customize the response for known errors
    if (err.name === 'ValidationError') {
        status = 400;
        message = Object.values(err.errors).map(e => e.message).join(', ');
    } else if (err.code === 11000) { // MongoDB duplicate key error
        status = 409;
        message = 'Duplicate field value entered';
    } else if (err.name === 'JsonWebTokenError') {
        status = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        status = 401;
        message = 'Token expired';
    }

    // Send the error response
    res.status(status).json({
        status: 'error',
        statusCode: status,
        message: message,
    });
};

module.exports = errorHandler;
