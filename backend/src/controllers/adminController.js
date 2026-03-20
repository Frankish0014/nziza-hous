import * as adminService from '../services/adminService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await adminService.getAnalytics();
    return successResponse(res, data);
  } catch (err) {
    return next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const data = await adminService.getUsers();
    return successResponse(res, data);
  } catch (err) {
    return next(err);
  }
};

