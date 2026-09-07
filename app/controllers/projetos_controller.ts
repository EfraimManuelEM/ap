import Projeto from '#models/projeto'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProjetosController {

  // ==========================================
  // LISTAR PROJETOS
  // ==========================================

  async index({}: HttpContext) {
    const projetos = await Projeto
      .query()
      .preload('tecnologias')

    return projetos
  }

  // ==========================================
  // CRIAR PROJETO
  // ==========================================

  async store({ request, response }: HttpContext) {

    const data = request.only([
      'titulo',
      'descricao',
      'status',
      'iamgem',
      'git',
      'ar',
    ])

    const tecnologias = request.input('tecnologias', [])

    console.log('Tecnologias recebidas:', tecnologias)

    // Criar projeto
    const projeto = await Projeto.create(data)

    // Salvar tecnologias na tabela pivot
    if (Array.isArray(tecnologias) && tecnologias.length > 0) {

      await projeto
        .related('tecnologias')
        .attach(tecnologias.map(Number))
    }

    // Carregar tecnologias novamente
    await projeto.load('tecnologias')

    console.log(
      'Projeto salvo:',
      projeto.serialize()
    )

    return response
      .status(201)
      .send(projeto)
  }

  // ==========================================
  // MOSTRAR PROJETO
  // ==========================================

  async show({ params }: HttpContext) {

    const projeto = await Projeto
      .query()
      .where('id', params.id)
      .preload('tecnologias')
      .firstOrFail()

    return projeto
  }

  // ==========================================
  // ATUALIZAR PROJETO
  // ==========================================

  async update({ params, request }: HttpContext) {

    const projeto = await Projeto.findOrFail(params.id)

    const data = request.only([
      'titulo',
      'descricao',
      'status',
      'iamgem',
      'git',
      'ar',
    ])

    const tecnologias = request.input(
      'tecnologias',
      []
    )

    // Atualizar projeto
    projeto.merge(data)

    await projeto.save()

    // Atualizar tecnologias
    if (Array.isArray(tecnologias)) {

      await projeto
        .related('tecnologias')
        .sync(tecnologias.map(Number))
    }

    await projeto.load('tecnologias')

    return projeto
  }

  // ==========================================
  // EXCLUIR PROJETO
  // ==========================================

  async destroy({ params, response }: HttpContext) {

    const projeto = await Projeto.findOrFail(params.id)

    await projeto.delete()

    return response.status(204).send(null)
  }
}