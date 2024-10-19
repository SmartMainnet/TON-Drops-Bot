import { chatAction } from '@grammyjs/auto-chat-action'
import { Composer, InlineKeyboard } from 'grammy'
import type { Context } from '#root/bot/context.js'
import { isAdmin } from '#root/bot/filters/index.js'
import { setCommandsHandler } from '#root/bot/handlers/index.js'
import { logHandle } from '#root/bot/helpers/logging.js'
import { NEWACTIVITY_CONVERSATION } from '../conversations/index.js'

const adminMenuKeyboard = new InlineKeyboard()
  .text('Новая активность', 'new_activity')
  .row()
  .text('Новый пост', 'new_post')

export const openAdminMenu = (ctx: Context) => {
  return ctx.reply(ctx.t('admin.menu'), {
    reply_markup: adminMenuKeyboard
  })
}

export const backToAdminMenu = async (ctx: Context) => {
  return await ctx.editMessageText(ctx.t('admin.menu'), {
    reply_markup: adminMenuKeyboard
  })
}

const composer = new Composer<Context>()

const feature = composer.chatType('private').filter(isAdmin)

feature.command(
  'setcommands',
  logHandle('command-setcommands'),
  chatAction('typing'),
  setCommandsHandler,
)

feature.command('newactivity', logHandle('command-newactivity'), (ctx) => {
  return ctx.conversation.enter(NEWACTIVITY_CONVERSATION)
})

feature.command('admin_menu', logHandle('command-admin-menu'), (ctx) => {
  return openAdminMenu(ctx)
})

feature.callbackQuery(
  'new_activity',
  logHandle('keyboard-new-activity'),
  async (ctx) => {
    return ctx.conversation.enter(NEWACTIVITY_CONVERSATION)
  },
)

export { composer as adminFeature }
