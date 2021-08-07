import Router from 'koa-router'
import { User } from './user/user.entity'
import { resources } from './package/resources'
import { mergeRoutingResources } from './package/mergeRoutes'
import { Photo } from './photo/photo.entity'

const router = new Router({
  prefix: "/api"
})

router.get('/', async (ctx) => {
  const { response } = ctx;

  response.status = 200

  response.body = {
    status: "ok"
  }
})

const userResources = resources<User>(User, { prefix: 'api', requestParameters: { required: ["name"] } })
const photoResources = resources(Photo, { prefix: 'api', join: ["user"] })

export default mergeRoutingResources(router, [userResources, photoResources])
