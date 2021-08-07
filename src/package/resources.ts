import Router from 'koa-router'
import { DeepPartial, getManager } from 'typeorm'
import pluralize from 'pluralize'
import { ExtendableContext } from 'koa'

const router = new Router()

interface RequestParameterOptions<Entity> {
  required?: (keyof Entity)[],
  optional?: (keyof Entity)[]
}

interface ResourceOptions<Entity> {
  prefix?: string;
  path?: string
  join?: string[]
  requestParameters?: RequestParameterOptions<Entity>
}

export const resources = <Entity>(entityClass: new (data: DeepPartial<Entity>) => Entity, options: ResourceOptions<Entity>): Router.Layer[] => {
  const { prefix, path, join = [], requestParameters } = options
  const resourceName = path || entityClass.name.toLowerCase()

  const route = pluralize(resourceName)

  const routeUrl = prefix ? `/${prefix}/${route}` : `/${route}`

  router.get(routeUrl, async (ctx) => {
    const { response, query } = ctx

    let relations: string[] = []

    if (query?.join && typeof query.join === 'string') {
      relations = [query?.join];
    }

    if (query?.join && typeof  query.join === 'object') {
      relations = [...query.join]
    }

    const result = await getManager().getRepository(entityClass).find({
      relations: join?.length ? join : relations,
    })

    response.status = 200

    return response.body = {
      [route]: result
    }
  })

  router.get(`${routeUrl}/:id`, async (ctx) => {
    const { response, params, query } = ctx
    const manager = getManager()

    let relations: string[] = []

    if (query?.join && typeof query.join === 'string') {
      relations = [query?.join];
    }

    if (query?.join && typeof  query.join === 'object') {
      relations = [...query.join]
    }

    const entityToRead = await manager.getRepository(entityClass).findOneOrFail({
      where: {
        id: params?.id,
      },
      relations: join?.length ? join : relations,
    })

    response.status = 200

    return response.body = {
      [resourceName]: entityToRead
    }
  })

  router.post(routeUrl, async (ctx) => {
    const { response, request } = ctx
    const { body } = request
    const manager = getManager()

    if (!validatePayload(requestParameters, ctx)) {
      return
    }

    const newEntityInstance = await manager.getRepository(entityClass).create({...body as any})

    const result = await manager.save(newEntityInstance)

    response.status = 200

    return response.body = {
      [resourceName]: result
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

export const validatePayload = <Entity>(parametersOptions: RequestParameterOptions<Entity> = { required: [], optional: [] }, context: ExtendableContext): boolean => {
  const { required } = parametersOptions
  const { request: { body } } = context

  const bodyKeys = Object.keys(body)

  const missingRequiredParams = required?.filter(requiredParameter => !bodyKeys?.includes(requiredParameter as string))

  if (missingRequiredParams?.length) {
    context.status = 400
    context.body = {
      errors: "Missing required parameters",
      parameters: missingRequiredParams,
    }

    return false
  }

  return true
}
