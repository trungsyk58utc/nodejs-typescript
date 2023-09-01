import { NextFunction, Request, Response } from 'express'
import { getMeService } from '~/services/users.services'

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(404).json({
        error: 'Token not found'
      })
    } else {
      const result = await getMeService(token)
      if (!result) {
        return res.status(403).json({
          error: 'Invalid token'
        })
      }
      next()
    }
  } catch (error) {
    return res.status(403).json({
      error: 'Invalid token'
    })
  }
}
