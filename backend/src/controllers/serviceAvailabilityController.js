import * as serviceAvailabilityService from '../services/serviceAvailabilityService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;
    const data = await serviceAvailabilityService.getAvailability({ serviceId: id, from, to });
    return successResponse(res, data);
  } catch (err) {
    return next(err);
  }
};

