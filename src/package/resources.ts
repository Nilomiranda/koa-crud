import Router from 'koa-router'
import { DeepPartial, getManager } from 'typeorm'
import pluralize from 'pluralize'

const router = new Router()

interface ResourceOptions {
  prefix?: string;
  path?: string
}

export const resources = <Entity>(entityClass: new (data: DeepPartial<Entity>) => Entity, options: ResourceOptions): Router.Layer[] => {
  const { prefix, path } = options
  const resourceName = path || entityClass.name.toLowerCase()

  const route = pluralize(resourceName)

  const routeUrl = prefix ? `/${prefix}/${route}` : `/${route}`

  router.get(routeUrl, async (ctx) => {
    const { response } = ctx

    const result = await getManager().getRepository(entityClass).find()

    response.status = 200

    return response.body = {
      [route]: result
    }
  })

  router.post(routeUrl, async (ctx) => {
    const { response, request } = ctx
    const { body } = request
    const manager = getManager()

    const newEntityInstance = await manager.getRepository(entityClass).create({...body as any})

    const result = await manager.save(newEntityInstance)

    response.status = 200

    return response.body = {
      [resourceName]: result
    }
  })

  router.get(`${routeUrl}/:id`, async (ctx) => {
    const { response, params } = ctx
    const manager = getManager()

    const entityToRead = await manager.getRepository(entityClass).findOneOrFail({
      where: {
        id: params?.id,
      }
    })

    response.status = 200

    return response.body = {
      [resourceName]: entityToRead
    }
  })

  router.patch(`${routeUrl}/:id`, async (ctx) => {
    const { response, request, params } = ctx
    const { body } = request
    const manager = getManager()

    const entityToBeEdited = await manager.getRepository(entityClass).findOneOrFail({
      where: {
        id: params?.id,
      }
    })

    const result = await manager.save(new entityClass({ ...entityToBeEdited, ...body as any }))

    response.status = 200

    return response.body = {
      [resourceName]: result
    }
  })

  router.delete(`${routeUrl}/:id`, async (ctx) => {
    const { response, params } = ctx
    const manager = getManager()

    const entityToBeDeleted = await manager.getRepository(entityClass).findOneOrFail({
      where: {
        id: params?.id,
      }
    })

    response.status = 200

    return response.body = await manager.getRepository(entityClass).delete((entityToBeDeleted as any)?.id)
  })

  return router?.stack
}
