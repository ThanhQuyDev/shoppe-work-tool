const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const kycValidation = require('../../validations/kyc.validation');
const kycController = require('../../controllers/kyc.controller');

const router = express.Router();

router.use(auth()); // Tất cả routes đều yêu cầu authentication

router.route('/').post(validate(kycValidation.createOrUpdateKYC), kycController.createOrUpdateKYC).get(kycController.getKYC);

router
  .route('/all')
  .get(auth('manageUsers'), validate(kycValidation.getKYCs), kycController.getAllKYCs);

router
  .route('/:kycId')
  .get(validate(kycValidation.getKYC), kycController.getKYCById);

router
  .route('/:kycId/approve')
  .patch(auth('manageUsers'), validate(kycValidation.approveKYC), kycController.approveKYC);

router
  .route('/:kycId/reject')
  .patch(auth('manageUsers'), validate(kycValidation.rejectKYC), kycController.rejectKYC);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: KYC
 *   description: Xac minh thong tin ca nhan (Know Your Customer)
 */

/**
 * @swagger
 * /kyc:
 *   post:
 *     summary: Gui thong tin KYC
 *     description: User gui thong tin xac minh (CCCD hoac ho chieu + anh chan dung).
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentType
 *               - documentNumber
 *               - fullName
 *               - dateOfBirth
 *               - gender
 *               - permanentAddress
 *               - frontImage
 *               - backImage
 *               - portraitImage
 *             properties:
 *               documentType:
 *                 type: string
 *                 enum: [cccd, passport]
 *                 description: Loai giay to (CCCD hoac ho chieu)
 *               documentNumber:
 *                 type: string
 *                 description: So giay to
 *               fullName:
 *                 type: string
 *                 description: Ho ten day du
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Ngay sinh
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: Gioi tinh
 *               nationality:
 *                 type: string
 *                 default: Vietnam
 *                 description: Quoc tich
 *               permanentAddress:
 *                 type: string
 *                 description: Dia chi thuong tru
 *               frontImage:
 *                 type: string
 *                 description: URL anh mat truoc giay to
 *               backImage:
 *                 type: string
 *                 description: URL anh mat sau giay to
 *               portraitImage:
 *                 type: string
 *                 description: URL anh chan dung
 *             example:
 *               documentType: cccd
 *               documentNumber: "001234567890"
 *               fullName: "NGUYEN VAN A"
 *               dateOfBirth: "1990-01-01"
 *               gender: male
 *               nationality: Vietnam
 *               permanentAddress: "123 Duong ABC, Phuong XYZ, Quan 1, TP.HCM"
 *               frontImage: "https://example.com/front.jpg"
 *               backImage: "https://example.com/back.jpg"
 *               portraitImage: "https://example.com/portrait.jpg"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/KYC'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   get:
 *     summary: Xem thong tin KYC cua user
 *     description: User xem thong tin KYC cua minh.
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/KYC'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /kyc/all:
 *   get:
 *     summary: Lay danh sach tat ca KYC (Admin)
 *     description: Admin xem danh sach tat ca cac yeu cau KYC.
 *     tags: [KYC]
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
 *                     $ref: '#/components/schemas/KYC'
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
 * /kyc/{id}:
 *   get:
 *     summary: Xem chi tiet KYC
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: KYC id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/KYC'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /kyc/{id}/approve:
 *   patch:
 *     summary: Duyet KYC (Admin)
 *     description: Admin duyet yeu cau KYC.
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: KYC id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/KYC'
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
 * /kyc/{id}/reject:
 *   patch:
 *     summary: Tu choi KYC (Admin)
 *     description: Admin tu choi yeu cau KYC.
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: KYC id
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rejectionReason:
 *                 type: string
 *                 description: Ly do tu choi
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/KYC'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

