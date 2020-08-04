const mongoose = require('mongoose');

afterAll(async () => {
    for (let i = 0; i < mongoose.connections.length; i++) {
        const connection = mongoose.connections[i];

        if (connection.db) {
            await connection.dropDatabase();
        }

        await connection.close();
    }
});