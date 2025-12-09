const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const systemBankAccountValidation = require('../../validations/systemBankAccount.validation');
const systemBankAccountController = require('../../controllers/systemBankAccount.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(systemBankAccountValidation.createSystemBankAccount), systemBankAccountController.createSystemBankAccount)
  .get(auth(), systemBankAccountController.getSystemBankAccount)
  .patch(auth('manageUsers'), validate(systemBankAccountValidation.updateSystemBankAccount), systemBankAccountController.updateSystemBankAccount)
  .delete(auth('manageUsers'), systemBankAccountController.deleteSystemBankAccount);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: SystemBankAccount
 *   description: Quan ly tai khoan ngan hang cua he thong (chi admin moi duoc thao tac)
 */

/**
 * @swagger
 * /system-bank-account:
 *   post:
 *     summary: Tao tai khoan ngan hang he thong
 *     description: Chi admin moi co quyen tao. He thong chi co 1 tai khoan ngan hang duy nhat.
 *     tags: [SystemBankAccount]
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
 *               bankNumber: "9876543210"
 *               userName: "CONG TY ABC"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SystemBankAccount'
 *       "400":
 *         description: System bank account already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: System bank account already exists
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Xem tai khoan ngan hang he thong
 *     description: Tat ca user da dang nhap deu co the xem thong tin tai khoan ngan hang cua he thong.
 *     tags: [SystemBankAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SystemBankAccount'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Cap nhat tai khoan ngan hang he thong
 *     description: Chi admin moi co quyen cap nhat.
 *     tags: [SystemBankAccount]
 *     security:
 *       - bearerAuth: []
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
 *               bankName: "Techcombank"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SystemBankAccount'
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
 *     summary: Xoa tai khoan ngan hang he thong
 *     description: Chi admin moi co quyen xoa.
 *     tags: [SystemBankAccount]
 *     security:
 *       - bearerAuth: []
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

