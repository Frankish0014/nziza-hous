import morgan from 'morgan';

// Use morgan as HTTP logger middleware
export const loggerMiddleware = morgan('combined');

