import databaseService from '~/services/database.service'
import { decodeRefreshToken } from '~/utils/jwtToken'

const updateExpiredToken = async () => {
  const listToken = await databaseService.refreshToken.find({}).toArray()
  if (listToken.length > 0) {
    const currentTime = Date.now()
    const listExpiredTokenId = []
    for (const token of listToken) {
      const decode = decodeRefreshToken(token.token)
      if ((decode.exp as number) * 1000 < currentTime) listExpiredTokenId.push(token._id)
    }
    await databaseService.refreshToken.deleteMany({ _id: { $in: listExpiredTokenId } })
  }
}

setInterval(updateExpiredToken, 5000)
