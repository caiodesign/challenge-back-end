declare namespace Express {
  export interface Request {
    app: {
      locals: {
        properties?: unknown
        cached?: boolean
      }
    }
  }
}
