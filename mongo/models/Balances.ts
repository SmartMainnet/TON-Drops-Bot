import mongoose from 'mongoose'

const { Schema } = mongoose

const Balances = new Schema(
  {
    user_id: {
      type: Number,
      required: true,
    }, // 1530690410
    asset: {
      type: String,
      required: true,
    }, // TON
    value: {
      type: Number,
      required: true,
    }, // 10.45
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

Balances.index({ user_id: 1, asset: 1 })

export const BalancesModel = mongoose.model('Balances', Balances)
