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
    const data = await request.validateUsing(createMessageValidator)

    console.log('========== SMTP CONFIG ==========')
    console.log('HOST:', mailConfig.host)
    console.log('PORT:', mailConfig.port)
    console.log('SECURE:', mailConfig.secure)
    console.log('USER:', mailConfig.auth.user)
    console.log('PASSWORD EXISTS:', !!mailConfig.auth.pass)
    console.log('PASSWORD LENGTH:', mailConfig.auth.pass?.length)
    console.log('TO:', mailConfig.to)
    console.log('=================================')

    const transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,

      auth: {
        user: mailConfig.auth.user,
        pass: mailConfig.auth.pass,
      },
    })

    console.log('Testando conexão SMTP...')

    await transporter.verify()

    console.log('SMTP conectado com sucesso!')

    const info = await transporter.sendMail({
      from: {
        name: mailConfig.from.name,
        address: mailConfig.from.address,
      },

      to: mailConfig.to,

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
        <h2>Nova mensagem do portfólio</h2>

        <p><strong>Nome:</strong> ${data.name}</p>

        <p><strong>Email:</strong> ${data.email}</p>

        <p><strong>Assunto:</strong> ${data.subject}</p>

        <hr>

        <h3>Mensagem</h3>

        <p>${data.message}</p>

        <br>

        <a href="mailto:${data.email}">
          Responder mensagem
        </a>
      `,
    })

    console.log('================================')
    console.log('EMAIL ENVIADO COM SUCESSO')
    console.log('MESSAGE ID:', info.messageId)
    console.log('================================')

    // Só salva no banco depois que o Gmail aceitar o email
    const message = await Message.create({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      read: false,
    })

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
    console.error('ERRO AO ENVIAR EMAIL')
    console.error('================================')

    console.error(error)

    return response.status(500).json({
      message: 'Não foi possível enviar a mensagem.',
      error: error instanceof Error
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