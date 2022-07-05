const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;
const authRoutes = express.Router();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

const user =  {
  name: "Octávio Barbosa",
  username: "octaviobarbosa",
  password: "$2b$10$uqSbxA9zGtKXjFClR6z3uOw4Qm9llTEsbgVeJdDtZ7dSAoRxDyK2e", // 12345
  isAuthenticated: false,
}

const messages = []

const isAuthenticated = (req, res, next) => {
  if(user.isAuthenticated) {
    req.isAuthenticated = true;
    next();
  } else {
    req.isAuthenticated = false;
    res.redirect('/login.html');
  }
}

authRoutes.get('/', isAuthenticated, (req, res) => {
  res.redirect('/index.html');
})

app.use(authRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) => {
  const { username, password }  = req.body;

  const usernameMatch = user.username === username;
  const passwordMatch = bcrypt.compareSync(password, user.password);

  if(usernameMatch && passwordMatch) {
    user.isAuthenticated = true;
    res.redirect('/');
  } else {
    user.isAuthenticated = false;
    res.status(401).json({ error: 'Usuário ou senha inválidos' });
  }
});

app.post('/logout', isAuthenticated, (req, res) => {
  user.isAuthenticated = false;
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  if(user.isAuthenticated) {
    res.redirect('/');
  } else {
    res.redirect('/login.html');
  }
})

authRoutes.get('/contato', isAuthenticated, (req, res) => {
  res.redirect('/contato.html');
})

authRoutes.get('/contato/list', isAuthenticated, (req, res) => {
  res.status(200).json(messages);
})

authRoutes.post('/contato', isAuthenticated, (req, res) => {
  const { name, email, message }  = req.body;

  messages.push({ name, email, message });
  res.redirect('/');
});

app.get('*', (req, res)  => res.status(404).redirect('/404.html'));

app.listen(port, () => console.log('Server listening on port 3000!')) 