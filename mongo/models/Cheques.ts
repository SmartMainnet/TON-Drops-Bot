import mongoose from 'mongoose'

import { getNextSequence } from '../utils/index.js'

const { Schema } = mongoose

const Cheques = new Schema(
  {
    id: Number, // 1

    owner_user_id: {
      type: Number,
      required: true,
    }, // 1530690410
    asset: {
      type: String,
      required: true,
    }, // 'FIRE'
    reward: {
      type: Number,
      required: true,
    }, // 100
    referral_reward: {
      type: Number,
      default: 0,
    }, // 100
    activations: {
      type: Number,
      required: true,
    }, // 1000000

    comment: String, // 'Приветственный чек для новых пользователей!'
    image_url: String, // 'https://i.ibb.co/GFwV7qh/image.png'

    notifications: {
      type: Boolean,
      default: true,
    }, // true

    languages: [
      {
        lang: String, // 'en'
        enable: Boolean, // true
      },
    ],

    only_for_premium: {
      type: Boolean,
      default: false,
    }, // false
    only_for_new_users: {
      type: Boolean,
      default: false,
    }, // false
    only_for_connected_wallet: {
      type: Boolean,
      default: false,
    }, // false

    password: String, // 'pass123'

    captcha: {
      type: Boolean,
      default: true,
    }, // true

    conditions: [
      {
        name: String, // 'subscribe' or 'boost'
        url: String, // 'https://t.me/xtondev'
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

Cheques.index({ id: 1, owner_user_id: 1 }, { unique: true })

Cheques.pre('save', async function (next) {
  if (this.isNew) {
    this.id = await getNextSequence('cheques')
  }
  next()
})

export const ChequesModel = mongoose.model('Cheques', Cheques)
