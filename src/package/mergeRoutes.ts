import Router from 'koa-router'

export const mergeRoutingResources = (router: Router<any, {}>, resources: Router.Layer[][]): Router<any, {}> => {
  router.stack = [...router.stack, ...resources.flat()]

  return router
}
