const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const referralValidation = require('../../validations/referral.validation');
const referralController = require('../../controllers/referral.controller');

const router = express.Router();

router.use(auth()); // Tất cả routes đều yêu cầu authentication

router.route('/stats').get(referralController.getReferralStats);

router
  .route('/tree')
  .get(validate(referralValidation.getReferralTree), referralController.getReferralTree);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Referral
 *   description: He thong gioi thieu va diem thuong
 */

/**
 * @swagger
 * /referral/stats:
 *   get:
 *     summary: Xem thong ke referral
 *     description: Xem thong ke ve he thong gioi thieu cua user (so nguoi da gioi thieu, so nguoi da kich hoat, tong diem).
 *     tags: [Referral]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 directReferrals:
 *                   type: integer
 *                   description: So nguoi da gioi thieu truc tiep
 *                 activatedDirectReferrals:
 *                   type: integer
 *                   description: So nguoi da gioi thieu va kich hoat
 *                 totalPointsEarned:
 *                   type: number
 *                   description: Tong diem da nhan duoc
 *                 isActivated:
 *                   type: boolean
 *                   description: Trang thai kich hoat cua user
 *             example:
 *               directReferrals: 5
 *               activatedDirectReferrals: 3
 *               totalPointsEarned: 4.5
 *               isActivated: true
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /referral/tree:
 *   get:
 *     summary: Xem cay gioi thieu
 *     description: Xem cay gioi thieu (downline) cua user.
 *     tags: [Referral]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: maxDepth
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           default: 3
 *         description: Do sau toi da cua cay gioi thieu
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tree:
 *                   type: array
 *                   description: Danh sach nguoi duoc gioi thieu truc tiep
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       isActivated:
 *                         type: boolean
 *                       points:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       children:
 *                         type: array
 *                         description: Danh sach nguoi duoc gioi thieu boi user nay
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

