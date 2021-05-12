import { CommonRoutesConfig } from '../common/common.routes.config'
import express from 'express'

import PropertiesController from './properties.controller'
import PropertiesMiddleware from './properties.middleware'
import PropertiesService from './properties.service'
import VivarealMiddleware from './vivareal/vivareal.middleware'
import zapMiddleware from './zap/zap.middleware'

export class PropertiesRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UsersRoutes')
  }

  configureRoutes() {
    this.app
      .route(`/properties`)
      .all(PropertiesMiddleware.validateCache.bind(PropertiesMiddleware))
      .all(PropertiesService.getProperties)
      .all(PropertiesMiddleware.saveIntoCache.bind(PropertiesMiddleware))
      .all(PropertiesMiddleware.pagination)
      .get(PropertiesController.sendProperties)

    this.app
      .route(`/properties/vivareal`)
      .all(PropertiesMiddleware.validateCache.bind(PropertiesMiddleware))
      .all(PropertiesService.getProperties)
      .all(VivarealMiddleware.filterProperties)
      .all(PropertiesMiddleware.pagination)
      .get(PropertiesController.sendProperties)

    this.app
      .route(`/properties/zap`)
      .all(PropertiesMiddleware.validateCache.bind(PropertiesMiddleware))
      .all(PropertiesService.getProperties)
      .all(zapMiddleware.filterProperties)
      .all(PropertiesMiddleware.pagination)
      .get(PropertiesController.sendProperties)

    this.app
      .route(`/property/:propertyId`)
      .all(PropertiesMiddleware.validateRequiredProperty)
      .all(PropertiesMiddleware.validateCache.bind(PropertiesMiddleware))
      .all(PropertiesService.getProperties)
      .all(PropertiesMiddleware.filterPropertiesById)
      .all(PropertiesMiddleware.saveIntoCache.bind(PropertiesMiddleware))
      .get(PropertiesController.sendProperties)

    return this.app
  }
}
