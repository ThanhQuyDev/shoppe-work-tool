const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const kycSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Mỗi user chỉ có 1 KYC
    },
    documentType: {
      type: String,
      enum: ['cccd', 'passport'],
      required: true,
    },
    documentNumber: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      default: 'Vietnam',
    },
    permanentAddress: {
      type: String,
      required: true,
      trim: true,
    },
    // URLs hoặc paths của ảnh
    frontImage: {
      type: String,
      required: true,
      trim: true,
    },
    backImage: {
      type: String,
      required: true,
      trim: true,
    },
    portraitImage: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    rejectedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
kycSchema.plugin(toJSON);
kycSchema.plugin(paginate);

/**
 * @typedef KYC
 */
const KYC = mongoose.model('KYC', kycSchema);

module.exports = KYC;

