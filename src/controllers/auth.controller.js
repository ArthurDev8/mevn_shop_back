const { User, Token } = require('../model');
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');

module.exports = {
  async login({ body: { email, password } }, res) {
    try {
      const foundUser = await User.findOne({ email });
      const isPasswordCorrect = passwordHash.verify(password, foundUser.password);
      if (!foundUser || !isPasswordCorrect) {
        return res.status(403).send({
          message: 'Логин или пароль не верный'
        })
      }
      function jwtToken(token, time = "1d") {
        return jwt.sign({
          userId: foundUser._id,
          email: foundUser.email
        }, token, { expiresIn: time });
      }
      const accessToken = jwtToken(process.env.JWT_SECRET, '1m');
      const refreshToken = jwtToken(process.env.JWT_SECRET_REFRESH, '30day');

      const foundToken = await Token.findOne({ user: foundUser._id })
      if (foundToken) {
        await Token.findByIdAnUpdate(foundToken._id, { token: refreshToken })
        return res.status(200).send({
          accessToken,
          refreshToken
        })
      }
      const item = new Token({ token: refreshToken, user: foundUser._id });
      await item.save();

      return res.status(200).send({
        accessToken,
        refreshToken
      })
    } catch (error) {
      return res.status(403).send({
        message: "Логин или пароль не подходят"
      })
    }
  },
  async signUp({ body: { email, password } }, res) {
    try {
      const foundUser = await User.findOne({ email });
      if (foundUser) {
        return res.status(403).send({
          message: 'Данный e-mail занят'
        })
      }
      const createdUser = new User({ email, password: passwordHash.generate(password) });
      await createdUser.save();

      return res.status(200).send({
        message: "Пользователь создан"
      })
    } catch (error) {
      return res.status(403).send({
        message: error
      })
    }
  },
  async logout({ body: { refreshToken } }, res) {
    const foundToken = await Token.findOne({ token: refreshToken });
    if (!foundToken) {
      return res.status(403).send({
        message: "Пользователь не авторизован"
      })
    }
    await Token.findByIdAndDelete(foundToken._id)
    return res.status(200).send({
      message: "Пользователь разлогинен"
    })
  },
  async refreshToken({ body: { refreshToken } }, res) {
    const currentToken = await Token.find({ token: refreshToken })

    if (!refreshToken && !currentToken) {
      return res.status(403).send({
        message: "Действие запрещено"
      })
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, (err, user) => {
      if (err) {
        return res.status(403).send({
          message: "Действие запрещено"
        })
      }
      const accessToken = jwt.sign({
        userId: user._id,
        email: user.email
      }, process.env.JWT_SECRET, {
        expiresIn: '1m'
      })
      res.status(200).send({ accessToken, email: user.email })
    })
  }
}
