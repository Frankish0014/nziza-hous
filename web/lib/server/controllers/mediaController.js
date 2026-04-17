import * as mediaService from '../services/mediaService.js';
import { successResponse } from '../utils/apiResponse.js';
import { publicUploadUrl } from '../utils/publicUrl.js';

export const addMedia = async (req, res, next) => {
  try {
    const data = await mediaService.addMedia({
      serviceId: Number(req.body.serviceId),
      url: req.body.url,
      altText: req.body.altText || null,
    });
    return successResponse(res, data, 'Media attached', 201);
  } catch (err) {
    return next(err);
  }
};

export const listMediaByService = async (req, res, next) => {
  try {
    const data = await mediaService.listMediaForService(Number(req.params.serviceId));
    return successResponse(res, data);
  } catch (err) {
    return next(err);
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });
    const fileUrl = publicUploadUrl(req, req.file.filename);
    return successResponse(res, { url: fileUrl, filename: req.file.filename }, 'Image uploaded', 201);
  } catch (err) {
    return next(err);
  }
};

