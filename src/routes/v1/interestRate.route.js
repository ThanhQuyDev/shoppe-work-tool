const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const interestRateValidation = require('../../validations/interestRate.validation');
const interestRateController = require('../../controllers/interestRate.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageInterestRates'),
    validate(interestRateValidation.createInterestRate),
    interestRateController.createInterestRate
  )
  .get(
    validate(interestRateValidation.getInterestRates),
    interestRateController.getInterestRates
  );

router
  .route('/:interestRateId')
  .get(
    validate(interestRateValidation.getInterestRate),
    interestRateController.getInterestRate
  )
  .patch(
    auth('manageInterestRates'),
    validate(interestRateValidation.updateInterestRate),
    interestRateController.updateInterestRate
  )
  .delete(
    auth('manageInterestRates'),
    validate(interestRateValidation.deleteInterestRate),
    interestRateController.deleteInterestRate
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: InterestRates
 *   description: Quan ly bang lai suat gui tiet kiem
 */

/**
 * @swagger
 * /interest-rates:
 *   post:
 *     summary: Tao moi muc lai suat gui tiet kiem
 *     description: Chi admin moi duoc tao, sua, xoa bang lai suat.
 *     tags: [InterestRates]
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
 *               - duration
 *               - durationAmount
 *               - rate
 *               - minAmount
 *             properties:
 *               name:
 *                 type: string
 *               duration:
 *                 type: string
 *                 description: 'Ky han (vi du: 10 thang, 12 thang)'
 *               durationAmount:
 *                 type: number
 *                 description: 'So thang (vi du: 10, 12)'
 *               rate:
 *                 type: number
 *                 format: float
 *                 description: Lai suat %/nam
 *               minAmount:
 *                 type: number
 *                 description: So tien gui toi thieu
 *               description:
 *                 type: string
 *                 description: Mo ta goi tiet kiem
 *               img:
 *                 type: string
 *                 description: URL hinh anh goi tiet kiem
 *             example:
 *               name: Goi tiet kiem 12 thang
 *               duration: 12 thang
 *               durationAmount: 12
 *               rate: 6.5
 *               minAmount: 1000000
 *               description: Goi tiet kiem uu dai 12 thang voi lai suat cao
 *               img: https://example.com/image.jpg
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/InterestRate'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Lay danh sach cac muc lai suat
 *     description: Public API, khong can dang nhap.
 *     tags: [InterestRates]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Ten goi lai suat
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: 'Ky han (vi du: 10 thang, 12 thang)'
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. rate:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of interestRates
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
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
 *                     $ref: '#/components/schemas/InterestRate'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /interest-rates/{id}:
 *   get:
 *     summary: Lay chi tiet mot muc lai suat
 *     description: Public API, khong can dang nhap.
 *     tags: [InterestRates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Interest rate id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/InterestRate'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Cap nhat mot muc lai suat
 *     description: Chi admin moi duoc cap nhat bang lai suat.
 *     tags: [InterestRates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Interest rate id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               duration:
 *                 type: string
 *               durationAmount:
 *                 type: number
 *               rate:
 *                 type: number
 *                 format: float
 *               minAmount:
 *                 type: number
 *               description:
 *                 type: string
 *               img:
 *                 type: string
 *             example:
 *               name: Goi tiet kiem uu dai 12 thang
 *               duration: 12 thang
 *               durationAmount: 12
 *               rate: 6.8
 *               minAmount: 2000000
 *               description: Goi tiet kiem uu dai voi lai suat cao nhat
 *               img: https://example.com/image2.jpg
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/InterestRate'
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
 *     summary: Xoa mot muc lai suat
 *     description: Chi admin moi duoc xoa bang lai suat.
 *     tags: [InterestRates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Interest rate id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

