import env from '#start/env'

export const mailConfig = {
  apiKey: env.get('RESEND_API_KEY', ''),

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