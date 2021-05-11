import express from 'express'

export class PropertiesController {
  async sendProperties(req: express.Request, res: express.Response) {
    if (req.app.locals.properties)
      return res.status(200).send(req.app.locals.properties)

    res.status(404).send({ error: `Not found` })
  }
}

export default new PropertiesController()
