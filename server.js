
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const userFile = path.join(__dirname, 'users.json');

// Load or initialize users
let users = {};
if (fs.existsSync(userFile)) {
  users = JSON.parse(fs.readFileSync(userFile));
}

function saveUsers() {
  fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
}

app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!users[username]) {
    users[username] = { balance: 100 };
    saveUsers();
  }
  res.json({ balance: users[username].balance });
});

app.post('/play', (req, res) => {
  const { username, color } = req.body;
  const options = ['Red', 'Green', 'Violet'];
  const result = options[Math.floor(Math.random() * options.length)];
  let message;
  if (color === result) {
    users[username].balance += 10;
    message = `You won! It was ${result}. (+10 BDT)`;
  } else {
    users[username].balance -= 5;
    message = `You lost! It was ${result}. (-5 BDT)`;
  }
  saveUsers();
  res.json({ balance: users[username].balance, message });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
