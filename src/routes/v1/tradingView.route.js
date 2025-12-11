const express = require('express');
const validate = require('../../middlewares/validate');
const tradingViewValidation = require('../../validations/tradingView.validation');
const tradingViewController = require('../../controllers/tradingView.controller');

const router = express.Router();

router.route('/klines').get(validate(tradingViewValidation.getKlines), tradingViewController.getKlines);
router.route('/klines/direct').get(validate(tradingViewValidation.getKlinesDirect), tradingViewController.getKlinesDirect);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: TradingView
 *   description: API lay du lieu bieu do TradingView
 */

/**
 * @swagger
 * /trading-view/klines:
 *   get:
 *     summary: Lay du lieu klines theo custom coin
 *     description: Lay du lieu nen (candlestick) theo ma custom coin. API se tu dong lay binanceSymbol cua coin do de goi Binance.
 *     tags: [TradingView]
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Ma custom coin (vi du BTCC, ETHC)
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *           enum: [1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M]
 *           default: 1h
 *         description: Khung thoi gian
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 200
 *           minimum: 1
 *           maximum: 1000
 *         description: So luong nen tra ve (toi da 1000)
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     symbol:
 *                       type: string
 *                     binanceSymbol:
 *                       type: string
 *                     description:
 *                       type: string
 *                     img:
 *                       type: string
 *                 klines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: integer
 *                       open:
 *                         type: number
 *                       high:
 *                         type: number
 *                       low:
 *                         type: number
 *                       close:
 *                         type: number
 *                       volume:
 *                         type: number
 *             example:
 *               coin:
 *                 id: "6750be1a954b54139806cabc"
 *                 name: "Bitcoin Clone"
 *                 symbol: "BTCC"
 *                 binanceSymbol: "BTCUSDT"
 *                 description: "Dong coin neo theo gia Bitcoin"
 *                 img: "https://example.com/btcc.png"
 *               klines:
 *                 - time: 1702296000
 *                   open: 43500.5
 *                   high: 43800.0
 *                   low: 43400.0
 *                   close: 43750.25
 *                   volume: 1234.56
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         description: Custom coin not found
 */

/**
 * @swagger
 * /trading-view/klines/direct:
 *   get:
 *     summary: Lay du lieu klines truc tiep tu Binance
 *     description: Lay du lieu nen (candlestick) truc tiep tu Binance API bang binance symbol.
 *     tags: [TradingView]
 *     parameters:
 *       - in: query
 *         name: symbol
 *         schema:
 *           type: string
 *           default: BTCUSDT
 *         description: Ma cap giao dich Binance (vi du BTCUSDT, ETHUSDT)
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *           enum: [1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M]
 *           default: 1h
 *         description: Khung thoi gian
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 200
 *           minimum: 1
 *           maximum: 1000
 *         description: So luong nen tra ve (toi da 1000)
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   time:
 *                     type: integer
 *                     description: Unix timestamp (seconds)
 *                   open:
 *                     type: number
 *                     description: Gia mo cua
 *                   high:
 *                     type: number
 *                     description: Gia cao nhat
 *                   low:
 *                     type: number
 *                     description: Gia thap nhat
 *                   close:
 *                     type: number
 *                     description: Gia dong cua
 *                   volume:
 *                     type: number
 *                     description: Khoi luong giao dich
 *             example:
 *               - time: 1702296000
 *                 open: 43500.5
 *                 high: 43800.0
 *                 low: 43400.0
 *                 close: 43750.25
 *                 volume: 1234.56
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */
