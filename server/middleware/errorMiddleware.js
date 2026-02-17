function notFound(req, res, _next) {
  res.status(404);
  res.json({
    ok: false,
    message: `Not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, _req, res, _next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    ok: false,
    message: err?.message || "Server error",
  });
}

module.exports = { notFound, errorHandler };

