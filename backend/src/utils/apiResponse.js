export const successResponse = (res, data, message = 'OK', status = 200) =>
  res.status(status).json({ success: true, message, data });

export const errorResponse = (res, error, status = 500) =>
  res.status(status).json({
    success: false,
    message: typeof error === 'string' ? error : error.message || 'Internal Server Error',
  });

