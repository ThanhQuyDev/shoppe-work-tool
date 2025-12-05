const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'node-express-boilerplate API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `https://e536921b6a8c.ngrok-free.app/v1`,
    },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['user', 'admin'] },
          balance: { type: 'number', description: 'So du hien tai cua user' },
        },
        example: {
          id: '5ebac534954b54139806c112',
          email: 'fake@example.com',
          name: 'fake name',
          role: 'user',
          balance: 0,
        },
      },
      InterestRate: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          duration: { type: 'string', description: "Ky han gui tiet kiem (vi du: '10 thang', '12 thang')" },
          durationAmount: { type: 'number', description: 'So thang (vi du: 10, 12)' },
          rate: { type: 'number', format: 'float', description: 'Lai suat (%/nam)' },
          minAmount: { type: 'number', description: 'So tien gui toi thieu' },
          description: { type: 'string', description: 'Mo ta goi tiet kiem' },
          img: { type: 'string', description: 'URL hinh anh goi tiet kiem' },
        },
        example: {
          id: '674f1a2b954b54139806c999',
          name: 'Goi tiet kiem 12 thang',
          duration: '12 thang',
          durationAmount: 12,
          rate: 6.5,
          minAmount: 1000000,
          description: 'Goi tiet kiem uu dai 12 thang voi lai suat cao',
          img: 'https://example.com/image.jpg',
        },
      },
      Saving: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          user: { type: 'string' },
          interestRate: { type: 'string' },
          interestRateSnapshot: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              duration: { type: 'string' },
              durationAmount: { type: 'number' },
              rate: { type: 'number' },
              minAmount: { type: 'number' },
            },
          },
          amount: { type: 'number' },
          termMonths: { type: 'number' },
          startDate: { type: 'string', format: 'date-time' },
          maturityDate: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['active', 'completed', 'withdrawn'] },
        },
        example: {
          id: '6750be1a954b54139806cabc',
          user: '5ebac534954b54139806c112',
          interestRate: '674f1a2b954b54139806c999',
          interestRateSnapshot: {
            name: 'Goi tiet kiem 12 thang',
            duration: '12 thang',
            durationAmount: 12,
            rate: 6.5,
            minAmount: 1000000,
          },
          amount: 10000000,
          termMonths: 12,
          startDate: '2025-12-04T08:00:00.000Z',
          maturityDate: '2026-12-04T08:00:00.000Z',
          status: 'active',
        },
      },
      Token: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          expires: { type: 'string', format: 'date-time' },
        },
        example: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg',
          expires: '2020-05-12T16:18:04.793Z',
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          access: { $ref: '#/components/schemas/Token' },
          refresh: { $ref: '#/components/schemas/Token' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          code: { type: 'number' },
          message: { type: 'string' },
        },
      },
    },
    responses: {
      BadRequest: {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { code: 400, message: 'Bad request' },
          },
        },
      },
      DuplicateEmail: {
        description: 'Email already taken',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { code: 400, message: 'Email already taken' },
          },
        },
      },
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { code: 401, message: 'Please authenticate' },
          },
        },
      },
      Forbidden: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { code: 403, message: 'Forbidden' },
          },
        },
      },
      NotFound: {
        description: 'Not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { code: 404, message: 'Not found' },
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

module.exports = swaggerDef;
