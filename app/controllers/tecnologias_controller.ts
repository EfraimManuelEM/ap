import Tecnologia from '#models/tecnologia'
import type { HttpContext } from '@adonisjs/core/http'

export default class TecnologiasController {
    async index({}: HttpContext) {
        const tecno = await Tecnologia.all()
        return tecno
    }

    async store({ request, response }: HttpContext) {
        const data = request.only(['nome', 'icon'])
        const tecno = await Tecnologia.create(data)
        response.status(201)
        return tecno
    }

    async show({ params }: HttpContext) {
        const tecno = await Tecnologia.findOrFail(params.id)
        return tecno
    }

    async update({ params, request }: HttpContext) {
        const tecno = await Tecnologia.findOrFail(params.id)
        const data = request.only(['nome', 'icon'])
        tecno.merge(data)
        await tecno.save()
        return tecno
    }

    async destroy({ params, response }: HttpContext) {
        const tecno = await Tecnologia.findOrFail(params.id)
        await tecno.delete()
        response.status(204)
    }
}