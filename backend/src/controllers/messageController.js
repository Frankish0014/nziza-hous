import * as messageService from '../services/messageService.js';
import { successResponse } from '../utils/apiResponse.js';

export const createMessage = async (req, res, next) => {
  try {
    const data = await messageService.createMessage(req.body);
    return successResponse(res, data, 'Message submitted', 201);
  } catch (err) {
    return next(err);
  }
};

export const listMessages = async (req, res, next) => {
  try {
    const data = await messageService.listMessages();
    return successResponse(res, data);
  } catch (err) {
    return next(err);
  }
};

