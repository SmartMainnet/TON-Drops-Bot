import { Composer, InlineKeyboard } from 'grammy'
import type { Context } from '#root/bot/context.js'
import { logHandle } from '#root/bot/helpers/logging.js'

const composer = new Composer<Context>()

const feature = composer.chatType('private')

feature.command('start', logHandle('command-start'), (ctx) => {
  return ctx.reply(ctx.t('welcome'), {
    reply_markup: new InlineKeyboard()
      .text('Активности', 'activities')
      .row()
      .text('Настройки')
  })
})

feature.callbackQuery(
  'activities',
  logHandle('keyboard-activities'),
  async (ctx) => {
    return ctx.editMessageText(ctx.t('language.changed'), {
      reply_markup: new InlineKeyboard()
      .text('Открыть')
    })
  }
)

export { composer as welcomeFeature }
