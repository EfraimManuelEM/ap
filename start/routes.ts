/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
        router.get('me', [controllers.AccessTokens, 'me']) .use(middleware.auth());
      })
      .prefix('auth')
      .as('auth') 

      router 
        .group(() => {
          router.get('user', [controllers.NewAccount, 'index'])
          router.get('/user/:id', [controllers.NewAccount, 'show'])
          router.put('/user', [controllers.NewAccount, 'update'])
          router.delete('/user', [controllers.NewAccount, 'destroy'])
        })

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('/mail', [controllers.Messages, 'store'])
        router.get('/mail', [controllers.Messages, 'index'])
        router.get('/mail/:id', [controllers.Messages, 'show'])
        router.delete('/mail/:id', [controllers.Messages, 'destroy'])
        router.patch('/mail/:id/read', [controllers.Messages, 'read'])
      })

    router
      .group(() => {
        router.post('/tecno', [controllers.Tecnologias, 'store'])
        router.get('/tecno', [controllers.Tecnologias, 'index'])
        router.get('/tecno/:id', [controllers.Tecnologias, 'show'])
        router.put('/tecno/:id', [controllers.Tecnologias, 'update'])
        router.delete('/tecno/:id', [controllers.Tecnologias, 'destroy'])
      })

      router
      .group(() => {
        router.post('/projeto', [controllers.Projetos, 'store'])
        router.get('/projeto', [controllers.Projetos, 'index'])
        router.get('/projeto/:id', [controllers.Projetos, 'show'])
        router.put('/projeto/:id', [controllers.Projetos, 'update'])
        router.delete('/projeto/:id', [controllers.Projetos, 'destroy'])
      })
  })
  .prefix('/api/v1')
