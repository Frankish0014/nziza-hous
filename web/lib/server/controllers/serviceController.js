import * as serviceService from '../services/serviceService.js';
import { successResponse } from '../utils/apiResponse.js';

export const listServices = async (req, res, next) => {
  try {
    const data = await serviceService.listServices();
    return successResponse(res, data);
  } catch (err) {
    return next(err);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const data = await serviceService.getServiceById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Service not found' });
    return successResponse(res, data);
  } catch (err) {
    return next(err);
  }
};

export const createService = async (req, res, next) => {
  try {
    const data = await serviceService.createService(req.body);
    return successResponse(res, data, 'Service created', 201);
  } catch (err) {
    return next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const data = await serviceService.updateService(Number(req.params.id), req.body);
    if (!data) return res.status(404).json({ success: false, message: 'Service not found' });
    return successResponse(res, data, 'Service updated');
  } catch (err) {
    return next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    await serviceService.deleteService(Number(req.params.id));
    return successResponse(res, null, 'Service deleted');
  } catch (err) {
    return next(err);
  }
};

