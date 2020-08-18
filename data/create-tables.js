const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );
                CREATE TABLE houses (
                  id SERIAL PRIMARY KEY,
                  house VARCHAR(256) NOT NULL
                );           
                CREATE TABLE got (
                    id SERIAL PRIMARY KEY NOT NULL,
                    name VARCHAR(512) NOT NULL,
                    image_url VARCHAR(512) NOT NULL,
                    number_of_kids INTEGER NOT NULL,
                    killed_off BOOLEAN NOT NULL,
                    description TEXT NOT NULL,
                    owner_id INTEGER NOT NULL REFERENCES users(id),
                    house_id INTEGER NOT NULL REFERENCES houses(id)
                );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
