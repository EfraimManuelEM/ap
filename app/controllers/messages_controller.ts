import type { HttpContext } from '@adonisjs/core/http'
import nodemailer from 'nodemailer'

import Message from '#models/message'
import { createMessageValidator } from '#validators/message'
import { mailConfig } from '../../config/mail.js'

export default class MessagesController {
  /**
   * =====================================================
   * UTILITÁRIOS
   * =====================================================
   */

  /**
   * Evita que conteúdo enviado pelo visitante
   * seja interpretado como HTML dentro do e-mail.
   */
  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  /**
   * Cria o transportador SMTP do Gmail.
   */
  private createTransporter() {
    return nodemailer.createTransport({
      host: mailConfig.host,

      /**
       * Gmail:
       * 587 = STARTTLS
       */
      port: 587,

      /**
       * Na porta 587 usamos STARTTLS.
       */
      secure: false,

      auth: {
        user: mailConfig.auth.user,
        pass: mailConfig.auth.pass,
      },

      tls: {
        rejectUnauthorized: true,
      },

      /**
       * Evita que a aplicação fique presa
       * indefinidamente tentando conectar.
       */
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    })
  }

  /**
   * =====================================================
   * ENVIAR MENSAGEM
   * =====================================================
   */
  async store({ request, response }: HttpContext) {
    try {
      /**
       * 1. Validar dados
       */
      const data = await request.validateUsing(
        createMessageValidator
      )

      /**
       * 2. Verificar configuração SMTP
       */
      console.log('================================')
      console.log('CONFIGURAÇÃO SMTP')
      console.log('================================')
      console.log('HOST:', mailConfig.host)
      console.log('PORTA:', 587)
      console.log('SECURE:', false)
      console.log('USUÁRIO:', mailConfig.auth.user)
      console.log(
        'PASSWORD EXISTE:',
        Boolean(mailConfig.auth.pass)
      )
      console.log(
        'COMPRIMENTO PASSWORD:',
        mailConfig.auth.pass?.length
      )
      console.log('DESTINO:', mailConfig.to)
      console.log('================================')

      /**
       * Verificação básica das variáveis.
       */
      if (!mailConfig.auth.user) {
        console.error('MAIL_USERNAME não configurado.')

        return response.status(500).json({
          message: 'Configuração de e-mail incompleta.',
        })
      }

      if (!mailConfig.auth.pass) {
        console.error('MAIL_PASSWORD não configurado.')

        return response.status(500).json({
          message: 'Senha SMTP não configurada.',
        })
      }

      if (!mailConfig.to) {
        console.error('MAIL_TO não configurado.')

        return response.status(500).json({
          message: 'E-mail de destino não configurado.',
        })
      }

      /**
       * 3. Criar transporter
       */
      const transporter = this.createTransporter()

      /**
       * 4. Testar conexão SMTP
       */
      console.log('================================')
      console.log('TESTANDO CONEXÃO SMTP...')
      console.log('================================')

      try {
        await transporter.verify()

        console.log('SMTP CONECTADO COM SUCESSO!')
      } catch (smtpError) {
        console.error('================================')
        console.error('ERRO AO CONECTAR AO SMTP')
        console.error('================================')

        console.error(smtpError)

        return response.status(500).json({
          message:
            'Não foi possível conectar ao servidor de e-mail.',

          error:
            smtpError instanceof Error
              ? smtpError.message
              : String(smtpError),
        })
      }

      /**
       * 5. Escapar conteúdo recebido
       */
      const name = this.escapeHtml(data.name)
      const email = this.escapeHtml(data.email)
      const subject = this.escapeHtml(data.subject)
      const messageText = this.escapeHtml(data.message)

      /**
       * 6. HTML do e-mail
       */
      const html = `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Nova mensagem - Portfólio</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f1f5f9;
    font-family:Arial,Helvetica,sans-serif;
    color:#0f172a;
  "
>

  <!-- Espaçamento -->
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background:#f1f5f9;
      padding:40px 16px;
    "
  >

    <tr>
      <td align="center">

        <!-- Container -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:650px;
            background:#ffffff;
            border-radius:18px;
            overflow:hidden;
            border:1px solid #e2e8f0;
          "
        >

          <!-- HEADER -->
          <tr>
            <td
              style="
                padding:32px;
                background:#0f172a;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <!-- Logo -->
                  <td>

                    <div
                      style="
                        width:48px;
                        height:48px;
                        line-height:48px;
                        text-align:center;
                        background:#5FA8A0;
                        color:#0f172a;
                        border-radius:12px;
                        font-size:22px;
                        font-weight:bold;
                      "
                    >
                      E
                    </div>

                  </td>

                  <!-- Categoria -->
                  <td
                    align="right"
                    style="
                      color:#94a3b8;
                      font-size:11px;
                      letter-spacing:1.5px;
                      font-weight:bold;
                    "
                  >
                    PORTFÓLIO
                  </td>

                </tr>

              </table>

              <h1
                style="
                  margin:28px 0 8px;
                  color:#ffffff;
                  font-size:28px;
                  line-height:1.3;
                "
              >
                Nova mensagem
              </h1>

              <p
                style="
                  margin:0;
                  color:#94a3b8;
                  font-size:14px;
                  line-height:1.6;
                "
              >
                Você recebeu uma nova mensagem através
                do seu portfólio.
              </p>

            </td>
          </tr>

          <!-- CONTEÚDO -->
          <tr>
            <td style="padding:32px;">

              <!-- Informações -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  border:1px solid #e2e8f0;
                  border-radius:12px;
                  overflow:hidden;
                "
              >

                <!-- Nome -->
                <tr>

                  <td
                    width="110"
                    style="
                      padding:16px;
                      color:#64748b;
                      font-size:12px;
                      font-weight:bold;
                      background:#f8fafc;
                    "
                  >
                    NOME
                  </td>

                  <td
                    style="
                      padding:16px;
                      color:#0f172a;
                      font-size:14px;
                      font-weight:600;
                    "
                  >
                    ${name}
                  </td>

                </tr>

                <!-- Email -->
                <tr>

                  <td
                    width="110"
                    style="
                      padding:16px;
                      color:#64748b;
                      font-size:12px;
                      font-weight:bold;
                      background:#f8fafc;
                      border-top:1px solid #e2e8f0;
                    "
                  >
                    EMAIL
                  </td>

                  <td
                    style="
                      padding:16px;
                      color:#5FA8A0;
                      font-size:14px;
                      border-top:1px solid #e2e8f0;
                    "
                  >
                    ${email}
                  </td>

                </tr>

                <!-- Assunto -->
                <tr>

                  <td
                    width="110"
                    style="
                      padding:16px;
                      color:#64748b;
                      font-size:12px;
                      font-weight:bold;
                      background:#f8fafc;
                      border-top:1px solid #e2e8f0;
                    "
                  >
                    ASSUNTO
                  </td>

                  <td
                    style="
                      padding:16px;
                      color:#0f172a;
                      font-size:14px;
                      border-top:1px solid #e2e8f0;
                    "
                  >
                    ${subject}
                  </td>

                </tr>

              </table>

              <!-- Título -->
              <div
                style="
                  margin-top:30px;
                  margin-bottom:12px;
                "
              >

                <span
                  style="
                    display:inline-block;
                    width:4px;
                    height:18px;
                    background:#5FA8A0;
                    border-radius:4px;
                    vertical-align:middle;
                    margin-right:8px;
                  "
                ></span>

                <span
                  style="
                    color:#0f172a;
                    font-size:16px;
                    font-weight:bold;
                    vertical-align:middle;
                  "
                >
                  Mensagem
                </span>

              </div>

              <!-- Mensagem -->
              <div
                style="
                  padding:22px;
                  background:#f8fafc;
                  border:1px solid #e2e8f0;
                  border-radius:12px;
                "
              >

                <p
                  style="
                    margin:0;
                    color:#334155;
                    font-size:14px;
                    line-height:1.8;
                    white-space:pre-line;
                  "
                >
                  ${messageText}
                </p>

              </div>

              <!-- Botão -->
              <div
                style="
                  margin-top:28px;
                  text-align:center;
                "
              >

                <a
                  href="mailto:${email}"
                  style="
                    display:inline-block;
                    padding:14px 24px;
                    background:#5FA8A0;
                    color:#0f172a;
                    text-decoration:none;
                    border-radius:10px;
                    font-size:14px;
                    font-weight:bold;
                  "
                >
                  Responder mensagem
                </a>

              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>

            <td
              style="
                padding:24px 32px;
                background:#f8fafc;
                border-top:1px solid #e2e8f0;
                text-align:center;
              "
            >

              <p
                style="
                  margin:0;
                  color:#64748b;
                  font-size:12px;
                  line-height:1.6;
                "
              >
                Mensagem enviada através do
                <strong style="color:#334155;">
                  Portfólio Efraim Manuel
                </strong>
              </p>

              <p
                style="
                  margin:6px 0 0;
                  color:#94a3b8;
                  font-size:11px;
                "
              >
                Full Stack Developer
              </p>

            </td>

          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>
</html>
      `

      /**
       * 7. Enviar e-mail
       */
      console.log('Enviando e-mail...')

      let info

      try {
        info = await transporter.sendMail({
          from: {
            name: mailConfig.from.name,
            address: mailConfig.from.address,
          },

          to: mailConfig.to,

          /**
           * Quando você clicar em "Responder"
           * no Gmail, responderá diretamente ao visitante.
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

          html,
        })
      } catch (emailError) {
        console.error('================================')
        console.error('ERRO AO ENVIAR EMAIL')
        console.error('================================')

        console.error(emailError)

        return response.status(500).json({
          message:
            'Não foi possível enviar o e-mail.',

          error:
            emailError instanceof Error
              ? emailError.message
              : String(emailError),
        })
      }

      /**
       * 8. Confirmar envio
       */
      console.log('================================')
      console.log('EMAIL ENVIADO COM SUCESSO')
      console.log('MESSAGE ID:', info.messageId)
      console.log('ACCEPTED:', info.accepted)
      console.log('REJECTED:', info.rejected)
      console.log('================================')

      /**
       * 9. Salvar no banco somente depois
       * que o Gmail aceitar o e-mail.
       */
      const message = await Message.create({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        read: false,
      })

      /**
       * 10. Resposta
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
      console.error('================================')
      console.error('ERRO NO CONTROLLER DE MENSAGENS')
      console.error('================================')

      console.error(error)

      /**
       * Erros de validação
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
        message:
          'Não foi possível processar a mensagem.',

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

      return response.json(messages)
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