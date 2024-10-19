import { Middleware } from "grammy";
import type { Context } from "../context.js";

export function autoDelete(): Middleware<Context> {
  return async (ctx, next) => {
    const { update } = ctx
    const { message } = update
    const text = message?.text

    if (text) {
      await ctx.api.deleteMessage(message.chat.id, message.message_id)
    }

    return await next()
  };
}
