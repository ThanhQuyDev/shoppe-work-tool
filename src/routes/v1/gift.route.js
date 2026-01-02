const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const giftValidation = require('../../validations/gift.validation');
const giftController = require('../../controllers/gift.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(giftValidation.createGift), giftController.createGift)
  .get(validate(giftValidation.getGifts), giftController.getGifts); // User có thể get list

router
  .route('/:giftId')
  .get(validate(giftValidation.getGift), giftController.getGift) // User có thể get detail
  .patch(auth('manageUsers'), validate(giftValidation.updateGift), giftController.updateGift)
  .delete(auth('manageUsers'), validate(giftValidation.deleteGift), giftController.deleteGift);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Gifts
 *   description: Quan ly qua tang
 */

/**
 * @swagger
 * /gifts:
 *   post:
 *     summary: Tao qua tang (Admin)
 *     description: Admin tao qua tang moi.
 *     tags: [Gifts]
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
 *               - pointsRequired
 *             properties:
 *               name:
 *                 type: string
 *                 description: Ten qua tang
 *               description:
 *                 type: string
 *                 description: Mo ta qua tang
 *               pointsRequired:
 *                 type: integer
 *                 description: So diem can de doi
 *                 minimum: 0
 *               isActive:
 *                 type: boolean
 *                 default: true
 *               img:
 *                 type: string
 *                 description: URL hinh anh qua tang
 *             example:
 *               name: "Voucher 100k"
 *               description: "Voucher giam gia 100k"
 *               pointsRequired: 1000
 *               isActive: true
 *               img: "https://example.com/voucher.png"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Gift'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Lay danh sach qua tang
 *     description: Lay danh sach tat ca qua tang (user va admin deu co the goi).
 *     tags: [Gifts]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Loc theo ten
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
 *                     $ref: '#/components/schemas/Gift'
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
 * /gifts/{id}:
 *   get:
 *     summary: Xem chi tiet qua tang
 *     description: Xem chi tiet mot qua tang (user va admin deu co the goi).
 *     tags: [Gifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gift id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Gift'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Cap nhat qua tang (Admin)
 *     tags: [Gifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gift id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               pointsRequired:
 *                 type: integer
 *                 minimum: 0
 *               isActive:
 *                 type: boolean
 *               img:
 *                 type: string
 *             example:
 *               name: "Voucher 100k Updated"
 *               pointsRequired: 1200
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Gift'
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
 *     summary: Xoa qua tang (Admin)
 *     tags: [Gifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gift id
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

