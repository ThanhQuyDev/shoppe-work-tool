const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const coinOrderValidation = require('../../validations/coinOrder.validation');
const coinOrderController = require('../../controllers/coinOrder.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(coinOrderValidation.createOrder), coinOrderController.createOrder)
  .get(auth(), validate(coinOrderValidation.getOrders), coinOrderController.getOrders);

router.route('/wallet').get(auth(), coinOrderController.getMyWallet);

router.route('/:orderId').get(auth(), validate(coinOrderValidation.getOrder), coinOrderController.getOrder);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: CoinOrders
 *   description: Mua ban coin
 */

/**
 * @swagger
 * /coin-orders:
 *   post:
 *     summary: Mua hoac ban coin
 *     description: User mua hoac ban coin. Gia duoc lay tu Binance tai thoi diem giao dich.
 *     tags: [CoinOrders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - amount
 *               - type
 *             properties:
 *               symbol:
 *                 type: string
 *                 description: Ma custom coin (vi du BTCC)
 *               amount:
 *                 type: number
 *                 description: So luong coin mua/ban
 *               type:
 *                 type: string
 *                 enum: [buy, sell]
 *                 description: buy = mua, sell = ban
 *             example:
 *               symbol: "BTCC"
 *               amount: 0.5
 *               type: "buy"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 symbol:
 *                   type: string
 *                 type:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 price:
 *                   type: number
 *                 total:
 *                   type: number
 *                 coinName:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *             example:
 *               id: "6750be1a954b54139806cabc"
 *               user: "5ebac534954b54139806c112"
 *               symbol: "BTCC"
 *               type: "buy"
 *               amount: 0.5
 *               price: 43500.25
 *               total: 21750.125
 *               coinName: "Bitcoin Clone"
 *               createdAt: "2025-12-11T10:00:00.000Z"
 *       "400":
 *         description: Insufficient balance or coin balance
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         description: Custom coin not found
 *
 *   get:
 *     summary: Xem lich su mua ban coin
 *     description: User xem lich su giao dich cua minh. Admin co the xem tat ca.
 *     tags: [CoinOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: symbol
 *         schema:
 *           type: string
 *         description: Loc theo ma coin
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [buy, sell]
 *         description: Loc theo loai giao dich
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Chi admin - loc theo user ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: field:desc/asc (default createdAt:desc)
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
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /coin-orders/wallet:
 *   get:
 *     summary: Xem vi coin cua toi
 *     description: Xem danh sach coin dang nam giu va gia tri hien tai.
 *     tags: [CoinOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   description: So du tien mat
 *                 wallet:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       symbol:
 *                         type: string
 *                       coinName:
 *                         type: string
 *                       img:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       currentPrice:
 *                         type: number
 *                       totalValue:
 *                         type: number
 *                 totalWalletValue:
 *                   type: number
 *                   description: Tong gia tri vi coin
 *             example:
 *               balance: 100000
 *               wallet:
 *                 - symbol: "BTCC"
 *                   coinName: "Bitcoin Clone"
 *                   img: "https://example.com/btcc.png"
 *                   amount: 0.5
 *                   currentPrice: 43500.25
 *                   totalValue: 21750.125
 *               totalWalletValue: 21750.125
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /coin-orders/{id}:
 *   get:
 *     summary: Xem chi tiet giao dich
 *     tags: [CoinOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order id
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

