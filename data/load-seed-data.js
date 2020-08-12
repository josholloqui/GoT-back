const client = require('../lib/client');
// import our seed data:
const got = require('./got.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      got.map(character => {
        return client.query(`
                    INSERT INTO got (name, number_of_kids, killed_off, house, description, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [character.name, character.number_of_kids, character.killed_off, character.house, character.description, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
