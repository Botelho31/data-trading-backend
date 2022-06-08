const jwt = require('jsonwebtoken')
const util = require('util')

const SECRET_KEY = process.env.JWT_SECRET

module.exports = {
  generateAccessToken (user) {
    return jwt.sign(user, SECRET_KEY, { expiresIn: '1h' })
  },
  async authenticateToken (req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    try {
      const verifyFunc = util.promisify(jwt.verify)
      const user = await verifyFunc(token, SECRET_KEY)
      req.user = user
      return next()
    } catch (err) {
      return res.sendStatus(403)
    }
  }
}
