const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const savingValidation = require('../../validations/saving.validation');
const savingController = require('../../controllers/saving.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(savingValidation.registerSaving), savingController.registerSaving)
  .get(auth(), validate(savingValidation.getSavings), savingController.getSavings);

router.route('/:savingId').get(auth(), validate(savingValidation.getSaving), savingController.getSaving);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Savings
 *   description: Dang ky va quan ly goi gui tiet kiem cua nguoi dung
 */

/**
 * @swagger
 * /savings:
 *   post:
 *     summary: Dang ky goi gui tiet kiem
 *     description: User can dung so du hien co de dang ky goi lai suat.
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - interestRateId
 *               - amount
 *             properties:
 *               interestRateId:
 *                 type: string
 *               amount:
 *                 type: number
 *                 description: So tien muon gui (phai lon hon hoac bang so tien toi thieu cua goi)
 *             example:
 *               interestRateId: 6750bc8e954b54139806c888
 *               amount: 10000000
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Saving'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   get:
 *     summary: Xem lich su dang ky goi tiet kiem
 *     description: Tra ve danh sach goi tiet kiem cua user dang dang nhap. Admin co the xem cua bat ky user thong qua query user.
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Chi danh cho admin
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
 *                     $ref: '#/components/schemas/Saving'
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
 * /savings/{id}:
 *   get:
 *     summary: Xem chi tiet goi tiet kiem
 *     description: User chi xem duoc goi cua chinh minh. Admin xem duoc tat ca.
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Saving id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Saving'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

