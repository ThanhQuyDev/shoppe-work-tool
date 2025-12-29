const express = require('express');
const validate = require('../../middlewares/validate');
const stockValidation = require('../../validations/stock.validation');
const stockController = require('../../controllers/stock.controller');

const router = express.Router();

router
  .route('/')
  .get(validate(stockValidation.getStocks), stockController.getStocks);

router
  .route('/:stockId')
  .get(validate(stockValidation.getStock), stockController.getStock);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Stocks
 *   description: Danh sach dong coin cho user (khong hien thi binanceSymbol)
 */

/**
 * @swagger
 * /stocks:
 *   get:
 *     summary: Lay danh sach dong coin
 *     description: Lay danh sach tat ca dong coin dang hoat dong cho user (khong hien thi binanceSymbol).
 *     tags: [Stocks]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Loc theo ten
 *       - in: query
 *         name: symbol
 *         schema:
 *           type: string
 *         description: Loc theo ma coin
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Loc theo trang thai
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: field:desc/asc
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       symbol:
 *                         type: string
 *                       description:
 *                         type: string
 *                       img:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 */

/**
 * @swagger
 * /stocks/{id}:
 *   get:
 *     summary: Xem chi tiet dong coin
 *     description: Xem chi tiet mot dong coin (khong hien thi binanceSymbol).
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 symbol:
 *                   type: string
 *                 description:
 *                   type: string
 *                 img:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

