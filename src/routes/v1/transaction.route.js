const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const transactionValidation = require('../../validations/transaction.validation');
const transactionController = require('../../controllers/transaction.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(transactionValidation.createTransaction), transactionController.createTransaction)
  .get(auth(), validate(transactionValidation.getTransactions), transactionController.getTransactions);

router
  .route('/:transactionId')
  .get(auth(), validate(transactionValidation.getTransaction), transactionController.getTransaction);

router
  .route('/:transactionId/approve')
  .patch(auth('manageTransactions'), validate(transactionValidation.approveTransaction), transactionController.approveTransaction);

router
  .route('/:transactionId/reject')
  .patch(auth('manageTransactions'), validate(transactionValidation.rejectTransaction), transactionController.rejectTransaction);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Nap rut tien cua nguoi dung
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Tao yeu cau nap/rut tien
 *     description: User tao yeu cau nap hoac rut tien. Thong tin ngan hang se duoc lay tu tai khoan ngan hang da lien ket cua user. User phai lien ket tai khoan ngan hang truoc khi tao giao dich.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - amount
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [deposit, withdraw]
 *                 description: deposit = nap tien, withdraw = rut tien
 *               amount:
 *                 type: number
 *                 description: So tien nap/rut
 *             example:
 *               type: deposit
 *               amount: 1000000
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
 *       "400":
 *         description: Bad request (chua lien ket ngan hang hoac so du khong du)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               noBankAccount:
 *                 value:
 *                   code: 400
 *                   message: Please link your bank account first
 *               insufficientBalance:
 *                 value:
 *                   code: 400
 *                   message: Insufficient balance
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   get:
 *     summary: Xem lich su giao dich
 *     description: User chi xem duoc giao dich cua chinh minh. Admin co the xem tat ca hoac loc theo user.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [deposit, withdraw]
 *         description: Loai giao dich
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Trang thai giao dich
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Chi danh cho admin - ID cua user
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
 *                     $ref: '#/components/schemas/Transaction'
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
 * /transactions/{id}:
 *   get:
 *     summary: Xem chi tiet giao dich
 *     description: User chi xem duoc giao dich cua chinh minh. Admin xem duoc tat ca.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /transactions/{id}/approve:
 *   patch:
 *     summary: Duyet yeu cau nap/rut tien
 *     description: Chi admin moi duoc duyet. Neu la nap tien thi cong vao so du, neu la rut tien thi tru tu so du.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
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
 * /transactions/{id}/reject:
 *   patch:
 *     summary: Tu choi yeu cau nap/rut tien
 *     description: Chi admin moi duoc tu choi. Yeu cau se bi huy bo.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
