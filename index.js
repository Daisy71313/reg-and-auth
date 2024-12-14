const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "public/text.sqlite",
});

const User = sequelize.define('User', 
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

sequelize.sync()

const app = express()

app.use(express.static('public'))
app.use(cors())
app.use(express.json())


 const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "2315", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Доступ запрещён" });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Токен не предоставлен. Ты не авторизован" });
  }
};


app.get('/profile', authenticateJWT, async (request, response) => {
    let email = request.user.email
    let user = await User.findOne({ where: { email: email } })
    response.send( {email: user.email, nickname: user.nickname} )
})

app.post('/register', async (request, response) => {
    const { email, nickname, password } = request.body
    let user = await User.create( {email, nickname, password } )

    let token = jwt.sign( { email: email }, "2315", { expiresIn: "30m" } )
    response.send( { token } )
})

app.post('/login', async (request, response) => {
    const { email, password } = request.body

    let user = await User.findOne( {where: {email: email}} )
    if(user == null)
    {
        return response.sendStatus(404)
    }

    if(user.password != password)
        return response.sendStatus(400)

    let token = jwt.sign( { email: email }, "2315", { expiresIn: "30m" } )
    response.send( { token } )
})


app.get('/hello', authenticateJWT, (request, response) => {
    response.send('Привет авторизованный пользователь')
})


app.listen(3000, () => {
    console.log('.........')
})