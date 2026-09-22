import type { HttpContext } from '@adonisjs/core/http'
import { Resend } from 'resend'

import Message from '#models/message'
import { createMessageValidator } from '#validators/message'
import { mailConfig } from '../../config/mail.js'

export default class MessagesController {
  /**
   * ============================================================
   * RESEND
   * ============================================================
   */
  private getResend(): Resend {
    if (!mailConfig.apiKey) {
      throw new Error(
        'RESEND_API_KEY não configurada.'
      )
    }

    return new Resend(
      mailConfig.apiKey
    )
  }

  /**
   * ============================================================
   * ESCAPAR HTML
   * ============================================================
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
   * ============================================================
   * CRIAR MENSAGEM
   * ============================================================
   */
  async store({
    request,
    response,
  }: HttpContext) {
    try {
      /**
       * ========================================================
       * 1. VALIDAR DADOS
       * ========================================================
       */
      const data =
        await request.validateUsing(
          createMessageValidator
        )

      console.log(
        '=========================================='
      )

      console.log(
        'NOVA MENSAGEM DE CONTACTO'
      )

      console.log(
        '=========================================='
      )

      console.log(
        'NOME:',
        data.name
      )

      console.log(
        'EMAIL:',
        data.email
      )

      console.log(
        'ASSUNTO:',
        data.subject
      )

      /**
       * ========================================================
       * 2. VALIDAR CONFIGURAÇÃO DE EMAIL
       * ========================================================
       */

      if (!mailConfig.apiKey) {
        console.error(
          'RESEND_API_KEY não configurada.'
        )

        return response.status(500).json({
          message:
            'Serviço de email não configurado.',
        })
      }

      if (!mailConfig.from.address) {
        console.error(
          'MAIL_FROM_ADDRESS não configurado.'
        )

        return response.status(500).json({
          message:
            'Email remetente não configurado.',
        })
      }

      if (!mailConfig.to) {
        console.error(
          'MAIL_TO não configurado.'
        )

        return response.status(500).json({
          message:
            'Email destinatário não configurado.',
        })
      }

      /**
       * ========================================================
       * 3. SALVAR NO BANCO
       * ========================================================
       *
       * Primeiro salvamos no MySQL.
       *
       * Dessa forma, mesmo que o serviço de email
       * esteja temporariamente indisponível,
       * a mensagem não será perdida.
       */
      console.log(
        '=========================================='
      )

      console.log(
        'SALVANDO MENSAGEM NO BANCO'
      )

      console.log(
        '=========================================='
      )

      const message =
        await Message.create({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          read: false,
        })

      console.log(
        'MENSAGEM SALVA COM ID:',
        message.id
      )

      /**
       * ========================================================
       * 4. ESCAPAR DADOS
       * ========================================================
       */

      const name =
        this.escapeHtml(
          data.name
        )

      const email =
        this.escapeHtml(
          data.email
        )

      const subject =
        this.escapeHtml(
          data.subject
        )

      const messageText =
        this
          .escapeHtml(
            data.message
          )
          .replace(
            /\n/g,
            '<br>'
          )

      /**
       * ========================================================
       * 5. ASSUNTO DA RESPOSTA
       * ========================================================
       */

      const replySubject =
        encodeURIComponent(
          `Re: ${data.subject}`
        )

      /**
       * ========================================================
       * 6. HTML DO EMAIL
       * ========================================================
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

  <title>Nova mensagem</title>

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

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background:#f1f5f9;
      padding:40px 15px;
    "
  >

    <tr>

      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:680px;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:
              0 10px 30px
              rgba(15,23,42,0.08);
          "
        >

          <!-- HEADER -->

          <tr>

            <td
              style="
                background:#0f172a;
                padding:35px 40px;
                text-align:center;
              "
            >

              <div
                style="
                  width:58px;
                  height:58px;
                  margin:0 auto 18px;
                  background:#5FA8A0;
                  border-radius:14px;
                  line-height:58px;
                  font-size:28px;
                  font-weight:bold;
                  color:#ffffff;
                "
              >
                E
              </div>

              <h1
                style="
                  margin:0;
                  color:#ffffff;
                  font-size:26px;
                  line-height:34px;
                "
              >
                Nova mensagem
              </h1>

              <p
                style="
                  margin:8px 0 0;
                  color:#cbd5e1;
                  font-size:14px;
                "
              >
                Recebida através do seu portfólio
              </p>

            </td>

          </tr>

          <!-- CONTENT -->

          <tr>

            <td
              style="
                padding:40px;
              "
            >

              <p
                style="
                  margin:0 0 25px;
                  color:#475569;
                  font-size:15px;
                  line-height:24px;
                "
              >
                Você recebeu uma nova mensagem
                através do formulário de contacto
                do seu portfólio.
              </p>

              <!-- INFORMATION -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  border:1px solid #e2e8f0;
                  border-radius:12px;
                  overflow:hidden;
                  margin-bottom:25px;
                "
              >

                <!-- NAME -->

                <tr>

                  <td
                    style="
                      padding:16px 18px;
                      background:#f8fafc;
                      border-bottom:
                        1px solid #e2e8f0;
                      width:120px;
                    "
                  >

                    <strong
                      style="
                        font-size:12px;
                        color:#64748b;
                        letter-spacing:.5px;
                      "
                    >
                      NOME
                    </strong>

                  </td>

                  <td
                    style="
                      padding:16px 18px;
                      border-bottom:
                        1px solid #e2e8f0;
                      font-size:15px;
                      color:#0f172a;
                    "
                  >
                    ${name}
                  </td>

                </tr>

                <!-- EMAIL -->

                <tr>

                  <td
                    style="
                      padding:16px 18px;
                      background:#f8fafc;
                      border-bottom:
                        1px solid #e2e8f0;
                    "
                  >

                    <strong
                      style="
                        font-size:12px;
                        color:#64748b;
                        letter-spacing:.5px;
                      "
                    >
                      EMAIL
                    </strong>

                  </td>

                  <td
                    style="
                      padding:16px 18px;
                      border-bottom:
                        1px solid #e2e8f0;
                      font-size:15px;
                    "
                  >

                    <a
                      href="mailto:${email}"
                      style="
                        color:#5FA8A0;
                        text-decoration:none;
                      "
                    >
                      ${email}
                    </a>

                  </td>

                </tr>

                <!-- SUBJECT -->

                <tr>

                  <td
                    style="
                      padding:16px 18px;
                      background:#f8fafc;
                    "
                  >

                    <strong
                      style="
                        font-size:12px;
                        color:#64748b;
                        letter-spacing:.5px;
                      "
                    >
                      ASSUNTO
                    </strong>

                  </td>

                  <td
                    style="
                      padding:16px 18px;
                      font-size:15px;
                      color:#0f172a;
                    "
                  >
                    ${subject}
                  </td>

                </tr>

              </table>

              <!-- MESSAGE -->

              <div
                style="
                  background:#f8fafc;
                  border:1px solid #e2e8f0;
                  border-radius:12px;
                  padding:24px;
                  margin-bottom:28px;
                "
              >

                <div
                  style="
                    font-size:12px;
                    font-weight:bold;
                    color:#64748b;
                    letter-spacing:.5px;
                    margin-bottom:12px;
                  "
                >
                  MENSAGEM
                </div>

                <div
                  style="
                    font-size:15px;
                    line-height:26px;
                    color:#334155;
                  "
                >
                  ${messageText}
                </div>

              </div>

              <!-- BUTTON -->

              <div
                style="
                  text-align:center;
                "
              >

                <a
                  href="mailto:${email}?subject=${replySubject}"
                  style="
                    display:inline-block;
                    background:#5FA8A0;
                    color:#ffffff;
                    text-decoration:none;
                    font-size:14px;
                    font-weight:bold;
                    padding:14px 24px;
                    border-radius:9px;
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
                background:#f8fafc;
                border-top:
                  1px solid #e2e8f0;
                padding:25px 40px;
                text-align:center;
              "
            >

              <p
                style="
                  margin:0;
                  color:#0f172a;
                  font-size:14px;
                  font-weight:bold;
                "
              >
                Portfólio Efraim Manuel
              </p>

              <p
                style="
                  margin:6px 0 0;
                  color:#64748b;
                  font-size:12px;
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
       * ========================================================
       * 7. ENVIAR EMAIL COM RESEND
       * ========================================================
       */
      console.log(
        '=========================================='
      )

      console.log(
        'ENVIANDO EMAIL COM RESEND'
      )

      console.log(
        '=========================================='
      )

      const resend =
        this.getResend()

      const {
        data: emailData,
        error: emailError,
      } = await resend.emails.send({
        from:
          `${mailConfig.from.name} <${mailConfig.from.address}>`,

        to: [
          mailConfig.to,
        ],

        replyTo:
          data.email,

        subject:
          `Novo contacto: ${data.subject}`,

        text: `
Nova mensagem recebida através do portfólio.

Nome: ${data.name}
Email: ${data.email}
Assunto: ${data.subject}

Mensagem:

${data.message}
        `,

        html,
      })

      /**
       * ========================================================
       * 8. ERRO DO RESEND
       * ========================================================
       */
      if (emailError) {
        console.error(
          '=========================================='
        )

        console.error(
          'ERRO AO ENVIAR EMAIL'
        )

        console.error(
          '=========================================='
        )

        console.error(
          'RESEND ERROR:',
          emailError
        )

        return response.status(500).json({
          message:
            'Mensagem recebida e salva, mas não foi possível enviar o e-mail.',

          data: {
            id: message.id,
          },

          error:
            emailError.message,
        })
      }

      /**
       * ========================================================
       * 9. EMAIL ENVIADO
       * ========================================================
       */

      console.log(
        '=========================================='
      )

      console.log(
        'EMAIL ENVIADO COM SUCESSO'
      )

      console.log(
        '=========================================='
      )

      console.log(
        'RESEND ID:',
        emailData?.id
      )

      /**
       * ========================================================
       * 10. RESPOSTA
       * ========================================================
       */

      return response.status(201).json({
        message:
          'Mensagem enviada com sucesso.',

        data: {
          id: message.id,

          name: message.name,

          email: message.email,

          subject: message.subject,

          createdAt:
            message.createdAt,

          emailId:
            emailData?.id,
        },
      })
    } catch (error) {
      /**
       * ========================================================
       * ERRO GERAL
       * ========================================================
       */

      console.error(
        '=========================================='
      )

      console.error(
        'ERRO NO CONTROLLER DE MENSAGENS'
      )

      console.error(
        '=========================================='
      )

      console.error(error)

      /**
       * ========================================================
       * ERRO DE VALIDAÇÃO
       * ========================================================
       */

      if (
        typeof error === 'object' &&
        error !== null &&
        'messages' in error
      ) {
        return response.status(422).json({
          message:
            'Dados inválidos.',

          errors:
            error.messages,
        })
      }

      /**
       * ========================================================
       * ERRO 500
       * ========================================================
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
   * ============================================================
   * LISTAR MENSAGENS
   * ============================================================
   */
  async index({
    response,
  }: HttpContext) {
    try {
      const messages =
        await Message
          .query()
          .orderBy(
            'created_at',
            'desc'
          )

      return response.json(
        messages
      )
    } catch (error) {
      console.error(error)

      return response.status(500).json({
        message:
          'Erro ao buscar mensagens.',
      })
    }
  }

  /**
   * ============================================================
   * MOSTRAR UMA MENSAGEM
   * ============================================================
   */
  async show({
    params,
    response,
  }: HttpContext) {
    try {
      const message =
        await Message.find(
          params.id
        )

      if (!message) {
        return response.status(404).json({
          message:
            'Mensagem não encontrada.',
        })
      }

      return response.json({
        data: message,
      })
    } catch (error) {
      console.error(error)

      return response.status(500).json({
        message:
          'Erro ao buscar mensagem.',
      })
    }
  }

  /**
   * ============================================================
   * MARCAR COMO LIDA
   * ============================================================
   */
  async read({
    params,
    response,
  }: HttpContext) {
    try {
      const message =
        await Message.find(
          params.id
        )

      if (!message) {
        return response.status(404).json({
          message:
            'Mensagem não encontrada.',
        })
      }

      message.read = true

      await message.save()

      return response.json({
        message:
          'Mensagem marcada como lida.',

        data: message,
      })
    } catch (error) {
      console.error(error)

      return response.status(500).json({
        message:
          'Erro ao atualizar mensagem.',
      })
    }
  }

  /**
   * ============================================================
   * APAGAR MENSAGEM
   * ============================================================
   */
  async destroy({
    params,
    response,
  }: HttpContext) {
    try {
      const message =
        await Message.find(
          params.id
        )

      if (!message) {
        return response.status(404).json({
          message:
            'Mensagem não encontrada.',
        })
      }

      await message.delete()

      return response.json({
        message:
          'Mensagem apagada com sucesso.',
      })
    } catch (error) {
      console.error(error)

      return response.status(500).json({
        message:
          'Erro ao apagar mensagem.',
      })
    }
  }
}