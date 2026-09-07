import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AccessTokensController {
  /**
   * LOGIN
   */
  async store({ request, response }: HttpContext) {
    const { email, password } =
      await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(
      email,
      password
    )

    const token = await User.accessTokens.create(user)

    return response.ok({
      token: token.value!.release(),

      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  }

  /**
   * USUÁRIO AUTENTICADO
   */
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      return response.ok({
        authenticated: true,

        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
    } catch (error) {
      console.error(
        'Erro ao buscar usuário autenticado:',
        error
      )

      return response.unauthorized({
        authenticated: false,
        message: 'Usuário não autenticado',
      })
    }
  }

  /**
   * LOGOUT
   */
  async destroy({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.currentAccessToken) {
      await User.accessTokens.delete(
        user,
        user.currentAccessToken.identifier
      )
    }

    return response.ok({
      message: 'Logout feito com sucesso',
    })
  }
}