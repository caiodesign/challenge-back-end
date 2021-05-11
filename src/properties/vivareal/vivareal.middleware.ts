import express from 'express'

import PropertiesValidators from '../../common/validators/common.validators'
import { VIVA_REAL } from '../../common/validators/common.validators.contants'

class VivarealMiddleware {
  public async filterProperties(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const _properties = req.app.locals.properties

    if (Array.isArray(_properties)) {
      req.app.locals.properties = _properties.filter((property) => {
        return PropertiesValidators.checkPropertyIsEligibleFor(
          VIVA_REAL.id,
          property
        )
      })
    }

    next()
  }
}

export default new VivarealMiddleware()
