import type { HttpContext } from '@adonisjs/core/http'
import nodemailer from 'nodemailer'
import Message from '#models/message'
import { createMessageValidator } from '#validators/message'
import { mailConfig } from '../../config/mail.js'
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'
import dns from 'node:dns/promises'

export default class MessagesController {
  /**
   * ============================================================
   * ESCAPAR HTML
   * ============================================================
   *
   * Evita que os dados enviados pelo formulário
   * sejam interpretados como HTML dentro do email.
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
   * CRIAR TRANSPORTER SMTP
   * ============================================================
   *
   * Gmail:
   *
   * MAIL_HOST=smtp.gmail.com
   * MAIL_PORT=587
   * MAIL_SECURE=false
   *
   * A porta 587 utiliza STARTTLS.
   *
   * O Railway estava tentando conectar através de IPv6.
   * Por isso resolvemos smtp.gmail.com manualmente para IPv4.
   */
  private async createTransporter(): Promise<nodemailer.Transporter> {
    console.log('==========================================')
    console.log('RESOLVENDO DNS DO SMTP')
    console.log('==========================================')

    const addresses = await dns.resolve4(mailConfig.host)

    if (!addresses.length) {
      throw new Error(
        `Não foi possível encontrar um endereço IPv4 para ${mailConfig.host}`
      )
    }

    const ipv4 = addresses[0]

    console.log('HOST SMTP:', mailConfig.host)
    console.log('IPv4 SMTP:', ipv4)
    console.log('PORTA SMTP:', mailConfig.port)
    console.log('SECURE:', mailConfig.secure)

    const smtpOptions: SMTPTransport.Options = {
      /**
       * Conecta diretamente ao IPv4.
       */
      host: ipv4,

      /**
       * Gmail SMTP.
       */
      port: Number(mailConfig.port),

      /**
       * Porta 587 = STARTTLS.
       *
       * Portanto:
       * secure = false
       */
      secure: Boolean(mailConfig.secure),

      /**
       * Autenticação Gmail.
       */
      auth: {
        user: mailConfig.auth.user,
        pass: mailConfig.auth.pass,
      },

      /**
       * TLS.
       *
       * servername continua sendo smtp.gmail.com
       * mesmo conectando através do IPv4.
       *
       * Isso é importante para a validação
       * do certificado/SNI.
       */
      tls: {
        servername: mailConfig.host,
        rejectUnauthorized: true,
      },

      /**
       * Timeout para conexão.
       */
      connectionTimeout: 30000,

      /**
       * Timeout para resposta inicial do servidor.
       */
      greetingTimeout: 30000,

      /**
       * Timeout do socket.
       */
      socketTimeout: 30000,
    }

    return nodemailer.createTransport(smtpOptions)
  }

  /**
   * ============================================================
   * CRIAR MENSAGEM
   * ============================================================
   */
  async store({ request, response }: HttpContext) {
    try {
      /**
       * ========================================================
       * 1. VALIDAR DADOS
       * ========================================================
       */
      const data = await request.validateUsing(
        createMessageValidator
      )

      /**
       * ========================================================
       * 2. CONFIGURAÇÃO SMTP
       * ========================================================
       */
      console.log('==========================================')
      console.log('CONFIGURAÇÃO SMTP')
      console.log('==========================================')

      console.log('HOST:', mailConfig.host)
      console.log('PORTA:', mailConfig.port)
      console.log('SECURE:', mailConfig.secure)
      console.log('USUÁRIO:', mailConfig.auth.user)

      console.log(
        'SENHA CONFIGURADA:',
        Boolean(mailConfig.auth.pass)
      )

      console.log(
        'COMPRIMENTO DA SENHA:',
        mailConfig.auth.pass?.length ?? 0
      )

      console.log(
        'FROM:',
        mailConfig.from.address
      )

      console.log(
        'TO:',
        mailConfig.to
      )

      /**
       * ========================================================
       * 3. VALIDAR CONFIGURAÇÕES
       * ========================================================
       */

      if (!mailConfig.host) {
        return response.status(500).json({
          message: 'MAIL_HOST não configurado.',
        })
      }

      if (!mailConfig.auth.user) {
        return response.status(500).json({
          message: 'MAIL_USERNAME não configurado.',
        })
      }

      if (!mailConfig.auth.pass) {
        return response.status(500).json({
          message: 'MAIL_PASSWORD não configurado.',
        })
      }

      if (!mailConfig.from.address) {
        return response.status(500).json({
          message: 'MAIL_FROM_ADDRESS não configurado.',
        })
      }

      if (!mailConfig.to) {
        return response.status(500).json({
          message: 'MAIL_TO não configurado.',
        })
      }

      /**
       * ========================================================
       * 4. SALVAR MENSAGEM NO BANCO
       * ========================================================
       *
       * Salvamos primeiro.
       *
       * Assim, se o Gmail estiver indisponível,
       * a mensagem do visitante não será perdida.
       */
      console.log('==========================================')
      console.log('SALVANDO MENSAGEM NO BANCO')
      console.log('==========================================')

      const message = await Message.create({
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
       * 5. CRIAR TRANSPORTER
       * ========================================================
       *
       * IMPORTANTE:
       *
       * createTransporter() é async porque usamos
       * dns.resolve4().
       */
      console.log('==========================================')
      console.log('CRIANDO TRANSPORTER SMTP')
      console.log('==========================================')

      const transporter = await this.createTransporter()

      /**
       * ========================================================
       * 6. ESCAPAR DADOS
       * ========================================================
       */

      const name = this.escapeHtml(
        data.name
      )

      const email = this.escapeHtml(
        data.email
      )

      const subject = this.escapeHtml(
        data.subject
      )

      const messageText = this
        .escapeHtml(data.message)
        .replace(/\n/g, '<br>')

      /**
       * ========================================================
       * 7. PREPARAR ASSUNTO DA RESPOSTA
       * ========================================================
       */

      const replySubject = encodeURIComponent(
        `Re: ${data.subject}`
      )

      /**
       * ========================================================
       * 8. TEMPLATE HTML DO EMAIL
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

          <!-- ========================================= -->
          <!-- HEADER -->
          <!-- ========================================= -->

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

          <!-- ========================================= -->
          <!-- CONTENT -->
          <!-- ========================================= -->

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

              <!-- ===================================== -->
              <!-- INFORMATION -->
              <!-- ===================================== -->

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

              <!-- ===================================== -->
              <!-- MESSAGE -->
              <!-- ===================================== -->

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

              <!-- ===================================== -->
              <!-- BUTTON -->
              <!-- ===================================== -->

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

          <!-- ========================================= -->
          <!-- FOOTER -->
          <!-- ========================================= -->

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
       * 9. ENVIAR EMAIL
       * ========================================================
       *
       * Não usamos transporter.verify().
       *
       * sendMail() fará a conexão diretamente.
       */
      console.log('==========================================')
      console.log('ENVIANDO EMAIL...')
      console.log('==========================================')

      let info: SMTPTransport.SentMessageInfo

      try {
        info = await transporter.sendMail({
          from: {
            name: mailConfig.from.name,
            address: mailConfig.from.address,
          },

          to: mailConfig.to,

          /**
           * Quando responder no Gmail,
           * a resposta vai para o visitante.
           */
          replyTo: data.email,

          subject: `Novo contacto: ${data.subject}`,

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
      } catch (emailError) {
        /**
         * ======================================================
         * ERRO SMTP
         * ======================================================
         */

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
          'TIPO:',
          emailError instanceof Error
            ? emailError.name
            : typeof emailError
        )

        console.error(
          'MENSAGEM:',
          emailError instanceof Error
            ? emailError.message
            : String(emailError)
        )

        if (
          typeof emailError === 'object' &&
          emailError !== null
        ) {
          const smtpError =
            emailError as {
              code?: string
              command?: string
              response?: string
              responseCode?: number
              errno?: number
              syscall?: string
              address?: string
              port?: number
            }

          console.error(
            'CÓDIGO:',
            smtpError.code
          )

          console.error(
            'COMANDO:',
            smtpError.command
          )

          console.error(
            'RESPOSTA SMTP:',
            smtpError.response
          )

          console.error(
            'CÓDIGO RESPOSTA:',
            smtpError.responseCode
          )

          console.error(
            'ENDEREÇO:',
            smtpError.address
          )

          console.error(
            'PORTA:',
            smtpError.port
          )

          console.error(
            'ERRNO:',
            smtpError.errno
          )

          console.error(
            'SYSCALL:',
            smtpError.syscall
          )
        }

        /**
         * A mensagem já foi salva no banco.
         *
         * Portanto não perdemos a mensagem
         * mesmo quando o email falha.
         */
        return response.status(500).json({
          message:
            'Mensagem recebida e salva, mas não foi possível enviar o e-mail.',

          data: {
            id: message.id,
          },

          error:
            emailError instanceof Error
              ? emailError.message
              : String(emailError),
        })
      }

      /**
       * ========================================================
       * 10. EMAIL ENVIADO COM SUCESSO
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
        'MESSAGE ID:',
        info.messageId
      )

      console.log(
        'ACCEPTED:',
        info.accepted
      )

      console.log(
        'REJECTED:',
        info.rejected
      )

      console.log(
        'RESPONSE:',
        info.response
      )

      /**
       * ========================================================
       * 11. RESPOSTA PARA O FRONTEND
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
  async index({ response }: HttpContext) {
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