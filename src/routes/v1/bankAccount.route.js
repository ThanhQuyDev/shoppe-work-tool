const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const bankAccountValidation = require('../../validations/bankAccount.validation');
const bankAccountController = require('../../controllers/bankAccount.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(bankAccountValidation.createBankAccount), bankAccountController.createBankAccount)
  .get(auth(), validate(bankAccountValidation.getBankAccounts), bankAccountController.getBankAccounts);

router.route('/me').get(auth(), bankAccountController.getMyBankAccount);

router
  .route('/:bankAccountId')
  .get(auth(), validate(bankAccountValidation.getBankAccount), bankAccountController.getBankAccount)
  .patch(auth(), validate(bankAccountValidation.updateBankAccount), bankAccountController.updateBankAccount)
  .delete(auth(), validate(bankAccountValidation.deleteBankAccount), bankAccountController.deleteBankAccount);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: BankAccounts
 *   description: Quan ly tai khoan ngan hang lien ket cua nguoi dung (moi user chi duoc lien ket 1 tai khoan)
 */

/**
 * @swagger
 * /bank-accounts:
 *   post:
 *     summary: Lien ket tai khoan ngan hang
 *     description: User chi co the lien ket 1 tai khoan ngan hang duy nhat.
 *     tags: [BankAccounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bankName
 *               - bankNumber
 *               - userName
 *             properties:
 *               bankName:
 *                 type: string
 *                 description: Ten ngan hang
 *               bankNumber:
 *                 type: string
 *                 description: So tai khoan ngan hang
 *               userName:
 *                 type: string
 *                 description: Ten chu tai khoan
 *             example:
 *               bankName: "Vietcombank"
 *               bankNumber: "1234567890"
 *               userName: "NGUYEN VAN A"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/BankAccount'
 *       "400":
 *         description: User already has a bank account linked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: User already has a bank account linked
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   get:
 *     summary: Xem danh sach tai khoan ngan hang da lien ket (Admin)
 *     description: Admin co the xem danh sach tat ca tai khoan ngan hang. User thuong chi xem duoc tai khoan cua minh.
 *     tags: [BankAccounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Chi danh cho admin
 *       - in: query
 *         name: bankName
 *         schema:
 *           type: string
 *         description: Loc theo ten ngan hang
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
 *                     $ref: '#/components/schemas/BankAccount'
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
 * /bank-accounts/me:
 *   get:
 *     summary: Xem tai khoan ngan hang cua toi
 *     description: Lay thong tin tai khoan ngan hang da lien ket cua user dang dang nhap.
 *     tags: [BankAccounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/BankAccount'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /bank-accounts/{id}:
 *   get:
 *     summary: Xem chi tiet tai khoan ngan hang
 *     description: User chi xem duoc tai khoan cua chinh minh. Admin xem duoc tat ca.
 *     tags: [BankAccounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank account id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/BankAccount'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Cap nhat tai khoan ngan hang
 *     description: User chi cap nhat duoc tai khoan cua chinh minh.
 *     tags: [BankAccounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank account id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName:
 *                 type: string
 *               bankNumber:
 *                 type: string
 *               userName:
 *                 type: string
 *             example:
 *               userName: "NGUYEN VAN B"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/BankAccount'
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
 *     summary: Xoa tai khoan ngan hang
 *     description: User chi xoa duoc tai khoan cua chinh minh.
 *     tags: [BankAccounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank account id
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
