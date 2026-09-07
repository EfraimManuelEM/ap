import type { HttpContext } from '@adonisjs/core/http'
import nodemailer from 'nodemailer'

import Message from '#models/message'
import { mailConfig } from '../../config/mail.js'
import { createMessageValidator } from '#validators/message'

export default class MessagesController {
  /**
   * =====================================================
   * ENVIAR MENSAGEM
   * =====================================================
   */
  async store({ request, response }: HttpContext) {
    try {

      console.log('EMAIL:', mailConfig.auth.user)
      console.log('PASSWORD LENGTH:', mailConfig.auth.pass?.length)
      console.log('SMTP conectado com sucesso')
      /**
       * 1. Validar dados
       */
      const data = await request.validateUsing(
        createMessageValidator
      )

      console.log('================================')
      console.log('DADOS RECEBIDOS:')
      console.log(data)
      console.log('================================')

      /**
       * 2. Salvar mensagem no banco
       */
      const message = await Message.create({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        read: false,
      })

      console.log('Mensagem salva no banco:', message.id)

      /**
       * 3. Criar transportador SMTP
       */
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,

        auth: {
          user: mailConfig.auth.user,
          pass: mailConfig.auth.pass,
        },
      })

      /**
       * 4. Testar conexão com Gmail
       */
      await transporter.verify()

      console.log('SMTP conectado com sucesso')

      /**
       * 5. Enviar e-mail
       */
      const info = await transporter.sendMail({
        from: {
          name: 'Portfólio Efraim Manuel',
          address: mailConfig.auth.user,
        },

        to: mailConfig.to,

        /**
         * Quando você clicar em responder no Gmail,
         * a resposta irá para o visitante.
         */
        replyTo: data.email,

        subject: `Novo contacto: ${data.subject}`,

        text: `
        Nova mensagem recebida pelo seu portfólio.

        Nome: ${data.name}

        Email: ${data.email}

        Assunto: ${data.subject}

        Mensagem:

        ${data.message}
                `,

               html: `
                  <!DOCTYPE html>
                  <html lang="pt">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Nova mensagem - Portfólio Efraim Manuel</title>
                  </head>

                  <body
                    style="
                      margin: 0;
                      padding: 0;
                      background-color: #0F1720;
                      font-family: Arial, Helvetica, sans-serif;
                      color: #e2e8f0;
                    "
                  >

                    <!-- Container principal -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="
                        background-color: #0F1720;
                        padding: 40px 15px;
                      "
                    >

                      <tr>
                        <td align="center">

                          <!-- Card -->
                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                              max-width: 620px;
                              background-color: #151F2B;
                              border: 1px solid #263746;
                              border-radius: 16px;
                              overflow: hidden;
                            "
                          >

                            <!-- Header -->
                            <tr>
                              <td
                                style="
                                  padding: 30px;
                                  background-color: #111B25;
                                  border-bottom: 1px solid #263746;
                                "
                              >

                                <table
                                  width="100%"
                                  cellpadding="0"
                                  cellspacing="0"
                                  border="0"
                                >

                                  <tr>

                                    <td>

                                      <div
                                        style="
                                          display: inline-block;
                                          width: 42px;
                                          height: 42px;
                                          line-height: 42px;
                                          text-align: center;
                                          background-color: #5FA8A0;
                                          border-radius: 10px;
                                          color: #0F1720;
                                          font-size: 20px;
                                          font-weight: bold;
                                        "
                                      >
                                        E
                                      </div>

                                    </td>

                                    <td
                                      align="right"
                                      style="
                                        font-size: 12px;
                                        color: #64748b;
                                      "
                                    >
                                      PORTFÓLIO
                                    </td>

                                  </tr>

                                </table>

                                <h1
                                  style="
                                    margin: 25px 0 8px 0;
                                    color: #f1f5f9;
                                    font-size: 25px;
                                    line-height: 1.3;
                                    font-weight: 700;
                                  "
                                >
                                  Nova mensagem
                                </h1>

                                <p
                                  style="
                                    margin: 0;
                                    color: #94a3b8;
                                    font-size: 14px;
                                    line-height: 1.6;
                                  "
                                >
                                  Você recebeu uma nova mensagem através do seu portfólio.
                                </p>

                              </td>
                            </tr>

                            <!-- Conteúdo -->
                            <tr>
                              <td style="padding: 30px;">

                                <!-- Informações -->
                                <table
                                  width="100%"
                                  cellpadding="0"
                                  cellspacing="0"
                                  border="0"
                                  style="
                                    background-color: #101820;
                                    border: 1px solid #263746;
                                    border-radius: 12px;
                                  "
                                >

                                  <!-- Nome -->
                                  <tr>

                                    <td
                                      width="110"
                                      style="
                                        padding: 18px 15px 8px 18px;
                                        color: #64748b;
                                        font-size: 12px;
                                        font-weight: 600;
                                        text-transform: uppercase;
                                      "
                                    >
                                      Nome
                                    </td>

                                    <td
                                      style="
                                        padding: 18px 18px 8px 5px;
                                        color: #e2e8f0;
                                        font-size: 14px;
                                        font-weight: 600;
                                      "
                                    >
                                      ${data.name}
                                    </td>

                                  </tr>

                                  <!-- Email -->
                                  <tr>

                                    <td
                                      width="110"
                                      style="
                                        padding: 8px 15px;
                                        color: #64748b;
                                        font-size: 12px;
                                        font-weight: 600;
                                        text-transform: uppercase;
                                      "
                                    >
                                      Email
                                    </td>

                                    <td
                                      style="
                                        padding: 8px 18px 8px 5px;
                                        color: #5FA8A0;
                                        font-size: 14px;
                                      "
                                    >
                                      ${data.email}
                                    </td>

                                  </tr>

                                  <!-- Assunto -->
                                  <tr>

                                    <td
                                      width="110"
                                      style="
                                        padding: 8px 15px 18px 18px;
                                        color: #64748b;
                                        font-size: 12px;
                                        font-weight: 600;
                                        text-transform: uppercase;
                                      "
                                    >
                                      Assunto
                                    </td>

                                    <td
                                      style="
                                        padding: 8px 18px 18px 5px;
                                        color: #e2e8f0;
                                        font-size: 14px;
                                      "
                                    >
                                      ${data.subject}
                                    </td>

                                  </tr>

                                </table>

                                <!-- Título da mensagem -->
                                <div
                                  style="
                                    margin-top: 28px;
                                    margin-bottom: 12px;
                                  "
                                >

                                  <span
                                    style="
                                      display: inline-block;
                                      width: 4px;
                                      height: 18px;
                                      background-color: #5FA8A0;
                                      border-radius: 4px;
                                      vertical-align: middle;
                                      margin-right: 8px;
                                    "
                                  ></span>

                                  <span
                                    style="
                                      color: #e2e8f0;
                                      font-size: 15px;
                                      font-weight: 700;
                                      vertical-align: middle;
                                    "
                                  >
                                    Mensagem
                                  </span>

                                </div>

                                <!-- Mensagem -->
                                <div
                                  style="
                                    padding: 22px;
                                    background-color: #101820;
                                    border: 1px solid #263746;
                                    border-radius: 12px;
                                  "
                                >

                                  <p
                                    style="
                                      margin: 0;
                                      color: #cbd5e1;
                                      font-size: 14px;
                                      line-height: 1.8;
                                      white-space: pre-line;
                                    "
                                  >
                                    ${data.message}
                                  </p>

                                </div>

                                <!-- Botão responder -->
                                <div
                                  style="
                                    margin-top: 25px;
                                    text-align: center;
                                  "
                                >

                                  <a
                                    href="mailto:${data.email}"
                                    style="
                                      display: inline-block;
                                      padding: 12px 22px;
                                      background-color: #5FA8A0;
                                      color: #0F1720;
                                      text-decoration: none;
                                      border-radius: 8px;
                                      font-size: 14px;
                                      font-weight: 700;
                                    "
                                  >
                                    Responder mensagem
                                  </a>

                                </div>

                              </td>
                            </tr>

                            <!-- Footer -->
                            <tr>

                              <td
                                style="
                                  padding: 22px 30px;
                                  background-color: #111B25;
                                  border-top: 1px solid #263746;
                                  text-align: center;
                                "
                              >

                                <p
                                  style="
                                    margin: 0;
                                    color: #64748b;
                                    font-size: 12px;
                                    line-height: 1.6;
                                  "
                                >
                                  Enviado através do portfólio de
                                  <strong style="color: #94a3b8;">
                                    Efraim Manuel
                                  </strong>
                                </p>

                                <p
                                  style="
                                    margin: 8px 0 0 0;
                                    color: #475569;
                                    font-size: 11px;
                                  "
                                >
                                  Full Stack Developer
                                </p>

                              </td>

                            </tr>

                          </table>

                          <!-- Texto externo -->
                          <p
                            style="
                              max-width: 620px;
                              margin: 18px auto 0 auto;
                              color: #475569;
                              font-size: 11px;
                              line-height: 1.5;
                            "
                          >
                            Esta mensagem foi enviada automaticamente pelo sistema de contacto
                            do portfólio.
                          </p>

                        </td>
                      </tr>

                    </table>

                  </body>
                  </html>
                  `,
      })

      console.log('E-mail enviado:', info.messageId)

      /**
       * 6. Resposta
       */
      return response.status(201).json({
        

        message: 'Mensagem enviada com sucesso.',

        data: {
          id: message.id,
          name: message.name,
          email: message.email,
          subject: message.subject,
          createdAt: message.createdAt,
        },
      })
    } catch (error) {
      /**
       * =================================================
       * ERRO
       * =================================================
       */

      console.error('================================')
      console.error('ERRO AO ENVIAR MENSAGEM')
      console.error('================================')

      console.error(error)

      /**
       * Erro de validação do Vine
       */
      if (
        typeof error === 'object' &&
        error !== null &&
        'messages' in error
      ) {
        return response.status(422).json({
          
          message: 'Dados inválidos.',

          errors: error.messages,
        })
      }

      /**
       * Outros erros
       */
      return response.status(500).json({
        

        message: 'Não foi possível enviar a mensagem.',

        error:
          error instanceof Error
            ? error.message
            : String(error),
      })
    }
  }

  /**
   * =====================================================
   * LISTAR MENSAGENS
   * =====================================================
   */
  async index({ response }: HttpContext) {
    try {
      const messages = await Message.query()
        .orderBy('created_at', 'desc')

      return messages
      
    } catch (error) {
      console.error(error)

      return response.status(500).json({
        
        message: 'Erro ao buscar mensagens.',
      })
    }
  }

  /**
   * =====================================================
   * BUSCAR UMA MENSAGEM
   * =====================================================
   */
  async show({ params, response }: HttpContext) {
    try {
      const message = await Message.find(params.id)

      if (!message) {
        return response.status(404).json({
          
          message: 'Mensagem não encontrada.',
        })
      }

      return response.json({
        
        data: message,
      })
    } catch (error) {
      console.error(error)

      return response.status(500).json({
        
        message: 'Erro ao buscar mensagem.',
      })
    }
  }

  /**
   * =====================================================
   * MARCAR COMO LIDA
   * =====================================================
   */
  async read({ params, response }: HttpContext) {
    try {
      const message = await Message.find(params.id)

      if (!message) {
        return response.status(404).json({
          
          message: 'Mensagem não encontrada.',
        })
      }

      message.read = true

      await message.save()

      return response.json({
        
        message: 'Mensagem marcada como lida.',
        data: message,
      })
    } catch (error) {
      console.error(error)

      return response.status(500).json({
        
        message: 'Erro ao atualizar mensagem.',
      })
    }
  }

  /**
   * =====================================================
   * APAGAR MENSAGEM
   * =====================================================
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const message = await Message.find(params.id)

      if (!message) {
        return response.status(404).json({
          
          message: 'Mensagem não encontrada.',
        })
      }

      await message.delete()

      return response.json({
        
        message: 'Mensagem apagada com sucesso.',
      })
    } catch (error) {
      console.error(error)

      return response.status(500).json({
        
        message: 'Erro ao apagar mensagem.',
      })
    }
  }
}