const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const giftExchangeValidation = require('../../validations/giftExchange.validation');
const giftExchangeController = require('../../controllers/giftExchange.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(giftExchangeValidation.createGiftExchange), giftExchangeController.createGiftExchange)
  .get(auth(), validate(giftExchangeValidation.getGiftExchanges), giftExchangeController.getGiftExchanges);

router
  .route('/all')
  .get(auth('manageUsers'), validate(giftExchangeValidation.getAllGiftExchanges), giftExchangeController.getAllGiftExchanges);

router
  .route('/:giftExchangeId')
  .get(auth(), validate(giftExchangeValidation.getGiftExchange), giftExchangeController.getGiftExchange);

router
  .route('/:giftExchangeId/approve')
  .patch(
    auth('manageUsers'),
    validate(giftExchangeValidation.approveGiftExchange),
    giftExchangeController.approveGiftExchange
  );

router
  .route('/:giftExchangeId/reject')
  .patch(
    auth('manageUsers'),
    validate(giftExchangeValidation.rejectGiftExchange),
    giftExchangeController.rejectGiftExchange
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: GiftExchange
 *   description: Doi qua tang bang diem referral
 */

/**
 * @swagger
 * /gift-exchanges:
 *   post:
 *     summary: Tao yeu cau doi qua tang
 *     description: User tao yeu cau doi qua tang, diem se bi tru ngay lap tuc.
 *     tags: [GiftExchange]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - giftId
 *             properties:
 *               giftId:
 *                 type: string
 *                 description: ID cua qua tang muon doi
 *             example:
 *               giftId: 6750be1a954b54139806cdef
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/GiftExchange'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   get:
 *     summary: Lay danh sach yeu cau doi qua tang cua user
 *     description: User xem danh sach cac yeu cau doi qua tang cua minh.
 *     tags: [GiftExchange]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
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
 *                     $ref: '#/components/schemas/GiftExchange'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /gift-exchanges/all:
 *   get:
 *     summary: Lay danh sach tat ca yeu cau doi qua tang (Admin)
 *     description: Admin xem danh sach tat ca cac yeu cau doi qua tang.
 *     tags: [GiftExchange]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Loc theo trang thai
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Loc theo user ID
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
 *                     $ref: '#/components/schemas/GiftExchange'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /gift-exchanges/{id}:
 *   get:
 *     summary: Xem chi tiet yeu cau doi qua tang
 *     tags: [GiftExchange]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gift exchange id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/GiftExchange'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */

/**
 * @swagger
 * /gift-exchanges/{id}/approve:
 *   patch:
 *     summary: Duyet yeu cau doi qua tang (Admin)
 *     description: Admin duyet yeu cau doi qua tang, cap nhat status thanh approved.
 *     tags: [GiftExchange]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gift exchange id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/GiftExchange'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /gift-exchanges/{id}/reject:
 *   patch:
 *     summary: Tu choi yeu cau doi qua tang (Admin)
 *     description: Admin tu choi yeu cau doi qua tang va tra lai diem cho user.
 *     tags: [GiftExchange]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gift exchange id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/GiftExchange'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

