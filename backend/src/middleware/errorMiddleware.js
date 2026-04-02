// Centralized error handler
// eslint-disable-next-line no-unused-vars
export const errorMiddleware = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'Uploaded file is too large' });
  }

  const status = err.status || err.statusCode || (err.name === 'MulterError' ? 400 : 500);
  const message =
    err.code === 'LIMIT_UNEXPECTED_FILE'
      ? 'Unexpected file field'
      : err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
  });
};

