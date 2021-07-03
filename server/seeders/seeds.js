const faker = require('faker');

const db = require('../config/connection');
const { User } = require('../models');

db.once('open', async () => {
    await User.remove({});

    // create user data
    const userData = [];

    for (let i=0; i < 50; i += 1) {
        const username = faker.internet.username();
        const email = faker.internet.email(username);
        const password = faker.internet.password();

        userData.push({ username, email, password });
    }

    const createdUsers = await User.collection.insert(userData);

    console.log('all done!');
    process.exit(0);
})