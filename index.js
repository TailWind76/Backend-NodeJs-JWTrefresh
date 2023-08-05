const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = 'your-secret-key';
const REFRESH_SECRET_KEY = 'your-refresh-secret-key';


function generateTokens(username) {
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ username }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
  return { token, refreshToken };
}

function authenticateRefreshToken(req, res, next) {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    req.user = decoded;
    next();
  });
}

app.post('/login', (req, res) => {


  if (authenticateUser(username, password)) {
    const { token, refreshToken } = generateTokens(username);
    return res.json({ token, refreshToken });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/refresh', authenticateRefreshToken, (req, res) => {
  const { token } = generateTokens(req.user.username);
  return res.json({ token });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
