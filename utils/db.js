const fs = require('fs');
const path = require('path');

const getAllUsers = () => fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json'));

const findUser = user => JSON.parse(getAllUsers())?.[user];

const saveUser = user => {
    const users = JSON.parse(getAllUsers());
    users[user.username] = user.id;
    fs.writeFileSync(path.join(__dirname, '..', 'data', 'users.json'), JSON.stringify(users));
};

const deleteAllUsers = () => fs.writeFileSync(path.join(__dirname, '..', 'data', 'users.json'), JSON.stringify({}));

module.exports = { findUser, saveUser, deleteAllUsers };
