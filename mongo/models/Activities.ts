import mongoose from 'mongoose'

import { getNextSequence } from '../utils/index.js'

const { Schema } = mongoose

const Activities = new Schema(
  {
    id: Number, // 1

    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },

    button_text: String,
    image_url: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

Activities.index({ id: 1 }, { unique: true })
Activities.index({ name: 1 })

Activities.pre('save', async function (next) {
  if (this.isNew) {
    this.id = await getNextSequence('activities')
  }
  next()
})

export const ActivitiesModel = mongoose.model('Activities', Activities)
