import express from 'express'
import Cache from '../common/common.cache'

import { CACHE_KEY } from './properties.constants'
import debug from 'debug'

import { Pagination } from './properties.interfaces'

const log: debug.IDebugger = debug('app:properties-middlewares')
class PropertiesMiddleware {
  constructor(protected cache = Cache) {}

  async validateRequiredProperty(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.params.propertyId) next()
    else res.status(400).send({ error: `Missing property ID` })
  }

  public async validateCache(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { propertyId } = req.params
    const key = propertyId ? `${CACHE_KEY}-property-${propertyId}` : CACHE_KEY

    const result = await this.cache.get(key)

    if (result) {
      req.app.locals.properties = result
      req.app.locals.cached = true
    }

    next()
  }

  public async saveIntoCache(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { params, query } = req

    if (query && req.app.locals.cached) return next()

    const key = params?.propertyId
      ? `${CACHE_KEY}-${params.propertyId}`
      : CACHE_KEY

    if (req.app.locals.properties) {
      log(`Updating cache for key: ${key}`)
      this.cache.set(key, req.app.locals.properties)
    }

    next()
  }

  public async filterPropertiesById(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { params } = req
    const _properties = req.app.locals.properties

    if (Array.isArray(_properties) && params.propertyId) {
      req.app.locals.properties = _properties.filter(
        (property) => property.id === params.propertyId
      )[0]
    }

    next()
  }

  public async pagination(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { query } = req
    const limit = 20
    const _properties = req.app.locals.properties

    if (Array.isArray(_properties) && query.page) {
      const startIndex = Number(query.page) * limit

      const result: Pagination = {
        data: [],
        pagination: {
          total: req.app.locals.properties.length,
          current_page: Number(query.page),
          limit
        }
      }

      result.data = _properties.filter(
        (property, index) => index >= startIndex && index <= startIndex + limit
      )

      req.app.locals.properties = result
    }

    next()
  }
}

export default new PropertiesMiddleware()
