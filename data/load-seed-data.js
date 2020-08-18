const client = require('../lib/client');
// import our seed data:
const got = require('./got.js');
const usersData = require('./users.js');
const housesData = require('./houses.js');
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
      housesData.map(house => {
        return client.query(`
                      INSERT INTO houses (house)
                      VALUES ($1);
                  `,
        [house.house]);
      })
    );

    await Promise.all(
      got.map(character => {
        return client.query(`
                    INSERT INTO got (name, image_url, number_of_kids, killed_off, description, owner_id, house_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
        [character.name, character.image_url, character.number_of_kids, character.killed_off, character.description, user.id, character.house_id]);
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
