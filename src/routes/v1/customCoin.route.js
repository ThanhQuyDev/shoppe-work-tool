const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const customCoinValidation = require('../../validations/customCoin.validation');
const customCoinController = require('../../controllers/customCoin.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(customCoinValidation.createCustomCoin), customCoinController.createCustomCoin)
  .get(validate(customCoinValidation.getCustomCoins), customCoinController.getCustomCoins);

router.route('/active').get(customCoinController.getActiveCoins);
router.route('/stocks').get(customCoinController.getListStocks);
router
  .route('/:coinId')
  .get(auth('manageUsers'),validate(customCoinValidation.getCustomCoin), customCoinController.getCustomCoin)
  .patch(auth('manageUsers'), validate(customCoinValidation.updateCustomCoin), customCoinController.updateCustomCoin)
  .delete(auth('manageUsers'), validate(customCoinValidation.deleteCustomCoin), customCoinController.deleteCustomCoin);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: CustomCoins
 *   description: Quan ly cac dong coin tuy chinh neo theo gia Binance
 */

/**
 * @swagger
 * /custom-coins:
 *   post:
 *     summary: Tao dong coin tuy chinh (Admin)
 *     description: Admin tao dong coin moi neo theo gia cua mot cap giao dich tren Binance.
 *     tags: [CustomCoins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - symbol
 *               - binanceSymbol
 *             properties:
 *               name:
 *                 type: string
 *                 description: Ten dong coin
 *               symbol:
 *                 type: string
 *                 description: Ma dong coin (unique)
 *               binanceSymbol:
 *                 type: string
 *                 description: Ma cap giao dich tren Binance de neo gia (vi du BTCUSDT)
 *               description:
 *                 type: string
 *                 description: Mo ta dong coin
 *               img:
 *                 type: string
 *                 description: URL hinh anh dong coin
 *               isActive:
 *                 type: boolean
 *                 default: true
 *             example:
 *               name: "Bitcoin Clone"
 *               symbol: "BTCC"
 *               binanceSymbol: "BTCUSDT"
 *               description: "Dong coin neo theo gia Bitcoin"
 *               img: "https://example.com/btcc.png"
 *               isActive: true
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/CustomCoin'
 *       "400":
 *         description: Symbol already taken
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Lay danh sach dong coin
 *     description: Lay danh sach tat ca dong coin tuy chinh.
 *     tags: [CustomCoins]
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
 *         name: binanceSymbol
 *         schema:
 *           type: string
 *         description: Loc theo ma Binance
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
 *                     $ref: '#/components/schemas/CustomCoin'
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
 * /custom-coins/stocks:
 *   get:
 *     summary: Lay danh sach dong coin
 *     description: Lay danh sach tat ca dong coin tuy chinh.
 *     tags: [CustomCoins]
 *     responses:
 *       "200":
 *         description: OK
 * @swagger
 * /custom-coins/active:
 *   get:
 *     summary: Lay danh sach dong coin dang hoat dong
 *     description: Lay tat ca dong coin co isActive = true.
 *     tags: [CustomCoins]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomCoin'
 */

/**
 * @swagger
 * /custom-coins/{id}:
 *   get:
 *     summary: Xem chi tiet dong coin
 *     tags: [CustomCoins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom coin id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/CustomCoin'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Cap nhat dong coin (Admin)
 *     tags: [CustomCoins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom coin id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *               binanceSymbol:
 *                 type: string
 *               description:
 *                 type: string
 *               img:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *             example:
 *               name: "Bitcoin Clone Updated"
 *               isActive: false
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/CustomCoin'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Xoa dong coin (Admin)
 *     tags: [CustomCoins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom coin id
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

