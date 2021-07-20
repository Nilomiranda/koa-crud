import Router from 'koa-router'
import { User } from '../user/user.entity'
import { resources } from '../package/resources'
import { mergeRoutingResources } from '../package/mergeRoutes'

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

const userResources = resources(User, { prefix: 'api' })

export default mergeRoutingResources(router, [userResources])
