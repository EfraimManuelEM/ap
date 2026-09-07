import vine from '@vinejs/vine'

export const createMessageValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(150),
    email: vine.string().trim().email().maxLength(255),
    subject: vine.string().trim().minLength(2).maxLength(255),
    message: vine.string().trim().minLength(5).maxLength(5000),
  })
)