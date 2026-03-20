export const validate = (schema) => async (req, res, next) => {
  try {
    const toValidate = {
      body: req.body,
      params: req.params,
      query: req.query,
    };
    await schema.validateAsync(toValidate, { abortEarly: false, allowUnknown: true });
    return next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [],
    });
  }
};

