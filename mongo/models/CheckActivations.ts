import mongoose from 'mongoose'

const { Schema } = mongoose

const CheckActivations = new Schema(
  {
    id: Number,

    check_id: {
      type: Number,
      required: true,
    },
    user_id: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

CheckActivations.index({ check_id: 1, user_id: 1 }, { unique: true })

export const CheckActivationsModel = mongoose.model(
  'CheckActivations',
  CheckActivations
)
