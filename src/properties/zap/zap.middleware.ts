import express from 'express'

import PropertiesValidators from '../../common/validators/common.validators'
import { ZAP } from '../../common/validators/common.validators.contants'

class ZapMiddleware {
  public async filterProperties(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const _properties = req.app.locals.properties

    if (Array.isArray(_properties)) {
      req.app.locals.properties = _properties.filter((property) => {
        return PropertiesValidators.checkPropertyIsEligibleFor(ZAP.id, property)
      })
    }

    next()
  }
}

export default new ZapMiddleware()
