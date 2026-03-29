// 404 Not Found handler
const notFound = (req, res, next) => {
    const error = new Error(`Not Found — ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global error handler
const errorHandler = (err, req, res, _next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    console.error(`❌ Error: ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        error: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = { notFound, errorHandler };
