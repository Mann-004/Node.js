const express = require('express');
const app = express();
const fs = require('fs')
const port = 3000;

app.use(express.urlencoded({ extended: false }))

const users = require('./MOCK_DATA.json');

app.get('/api/users', (req, res) => {
  return res.json(users);
})

app.route('/api/users/:id')
  .get((req, res) => {
    const id = Number(req.params.id)
    // console.log(typeof(id))
    const user = users.find((user) => user.id === id)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user)
  })
  .patch('/api/users/:id', (req, res) => {
    const id = Number(req.params.id); 
    const body = req.body;            

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    users[userIndex] = { ...users[userIndex], ...body };
    // file updation 
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ status: "error", message: "Failed to save changes" });
      }
    return res.json({ status: "success", updatedUser: users[userIndex] });
    })
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const deletedUser = users.find(user => user.id === id);
    if (!deletedUser) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const remainingUsers = users.filter(user => user.id !== id);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(remainingUsers, null, 2), (err, data) => {
      if (err) {
        return res.status(500).json({ status: "error", message: "Failed to delete user" });
      }
      return res.json({
        status: "success",
        deletedUserID: deletedUser.id,
      });
    });
  });

app.post('/api/users', (req, res) => {
  const body = req.body
  console.log(body)
  users.push({ id: users.length + 1, ...body })
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: users.length })
  })

})

app.get('/users', (req, res) => {
  const userList = users
    .map((item) => `<li>${item.first_name} ${item.last_name}</li>`)
    .join("");

  return res.send(`
      <html>
        <body>
          <h1>User List</h1>
          <ul>${userList}</ul>
        </body>
      </html>
    `)
})


app.listen(port || 8000, () => {
  console.log(`Example app listening on port ${port}`);
});
