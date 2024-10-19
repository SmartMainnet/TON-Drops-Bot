import { InlineKeyboard } from 'grammy'
import { createConversation, type Conversation } from '@grammyjs/conversations'
import { i18n } from '../i18n.js'
import { backToAdminMenu } from '../features/index.js'
import type { Context } from '../context.js'

export const NEWACTIVITY_CONVERSATION = 'newactivity'

const activity = {
  name: '',
  description: '',
  link: '',
  button_text: '',
  image_url: '',
}

export function newactivityConversation() {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      await conversation.run(i18n)
      await runSteps(conversation, ctx)
    },
    NEWACTIVITY_CONVERSATION,
  )
}

const steps = ['name', 'description', 'link']

async function runSteps(conversation: Conversation<Context>, ctx: Context) {
  let step = 0

  while (step < steps.length) {
    await ctx.editMessageText(ctx.t(`activity.select_${steps[step]}`), {
      reply_markup: new InlineKeyboard().text(ctx.t('button.back'), 'back'),
    })

    const { update } = await conversation.wait()
    const { message, callback_query } = update
    const text = message?.text
    const data = callback_query?.data

    if (text && text[0] !== '/') {
      activity[steps[step] as keyof typeof activity] = text
      step++
    } else if (data === 'back' && step > 0) {
      step--
    } else {
      await backToAdminMenu(ctx)
      return
    }
  }

  if (step === steps.length) {
    await previewActivity(conversation, ctx)
  }
}

async function previewActivity(conversation: Conversation<Context>, ctx: Context) {
  await ctx.editMessageText(
    ctx.t('activity.preview', {
      name: activity.name,
      description: activity.description,
    }),
    {
      reply_markup: new InlineKeyboard()
      .url(activity.button_text || `Открыть ${activity.name}`, activity.link)
      .row()
      .text('✅ Опубликовать', 'create_activity')
      .text('❌ Отменить', 'back_to_admin_menu')
      .row()
      .text('📰 Протестировать публикацию', 'test_activity')
      .row()
      .text('Изменить название активности', 'select_name')
      .row()
      .text('Изменить описание активности', 'select_description')
      .row()
      .text('Изменить ссылку на активность', 'select_link')
      .row()
      .text('Изменить текст кнопки на активность', 'select_button_text')
      .row()
      .text(`${activity.image_url ? 'Изменить' : 'Добавить'} картинку`, 'select_image_url')
      .row()
      .text(activity.image_url ? 'Удалить картинку' : '', 'delete_image_url')
    }
  )

  const { update } = await conversation.wait()
  const { callback_query } = update
  const data = callback_query?.data

  const options = ['select_name', 'select_description', 'select_link', 'select_button_text', 'select_image_url']

  if (data && options.includes(data)) {
    const option_name: any = data.replace('select_', '')
    await changeOption(conversation, ctx, option_name)
  } else if (data === 'back_to_admin_menu') {
    return backToAdminMenu(ctx)
  } else {
    return
  }
}

async function changeOption(conversation: Conversation<Context>, ctx: Context, option_name: string) {
  await ctx.editMessageText(ctx.t(`activity.select_${option_name}`), {
    reply_markup: new InlineKeyboard().text(ctx.t('button.back'), 'back'),
  })

  const { update } = await conversation.wait()
  const { message, callback_query } = update
  const text = message?.text
  const data = callback_query?.data

  if (text) {
    activity[option_name as keyof typeof activity] = text

    await previewActivity(conversation, ctx)
  } else if (data === 'back') {
    await previewActivity(conversation, ctx)
  } else {
    return
  }
}
