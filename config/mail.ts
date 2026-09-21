import env from '#start/env'

export const mailConfig = {
  host: env.get('MAIL_HOST', 'smtp.gmail.com'),

  port: Number(
    env.get('MAIL_PORT', '587')
  ),

  secure:
    env.get('MAIL_SECURE', 'false') === 'true',

  auth: {
    user: env.get('MAIL_USERNAME', ''),
    pass: env.get('MAIL_PASSWORD', ''),
  },

  from: {
    name: env.get(
      'MAIL_FROM_NAME',
      'Portfólio Efraim Manuel'
    ),

    address: env.get(
      'MAIL_FROM_ADDRESS',
      ''
    ),
  },

  to: env.get(
    'MAIL_TO',
    ''
  ),
}