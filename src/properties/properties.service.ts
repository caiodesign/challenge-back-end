import express from 'express'

import { getGrupoZapProperties } from './properties.provider'

export class PropertiesService {
  async getProperties(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.app.locals.cached) return next()

    const response = await getGrupoZapProperties()
    req.app.locals.properties = response.data

    next()
  }
}

export default new PropertiesService()
