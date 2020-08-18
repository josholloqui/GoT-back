const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

const adminUser = {
  id: 1,
  email: 'jon@snow.com',
  hash: '56g74fc'
};

app.get('/got', async(req, res) => {
  const gotData = await client.query(`
    SELECT g.id, name, image_url, number_of_kids, killed_off, description, h.house
    FROM got AS g
    JOIN houses AS h
    ON g.house_id = h.id
  `);

  res.json(gotData.rows);
});

app.get('/houses', async(req, res) => {
  const houseData = await client.query('SELECT * FROM houses');

  res.json(houseData.rows);
});

app.get('/got/:id', async(req, res) => {
  const gotID = req.params.id;

  const gotData = await client.query(`
    SELECT g.id, name, image_url, number_of_kids, killed_off, description, h.house
      FROM got AS g
      JOIN houses AS h
      ON g.house_id = h.id
      WHERE g.id=$1
  `, [gotID]);

  res.json(gotData.rows[0]);
});

app.post('/got', async(req, res) => {
  try {
    const newCharacter = {
      name: req.body.name,
      image_url: req.body.image_url,
      number_of_kids: req.body.number_of_kids,
      killed_off: req.body.killed_off,
      description: req.body.description,
      house_id: req.body.house_id
    };

    const gotData = await client.query(`
    INSERT INTO got(name, image_url, number_of_kids, killed_off, description, owner_id, house_id)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `, [newCharacter.name, newCharacter.image_url, newCharacter.number_of_kids, newCharacter.killed_off, newCharacter.description, adminUser.id, newCharacter.house_id]);

    res.json(gotData.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/got/:id', async(req, res) => {
  const gotID = req.params.id;

  const gotData = await client.query('DELETE FROM got WHERE got.id=$1;', [gotID]);

  res.json(gotData.rows[0]);
});

app.put('/got/:id', async(req, res) => {
  const gotID = req.params.id;

  try {
    const updatedCharacter = {
      name: req.body.name,
      image_url: req.body.image_url,
      number_of_kids: req.body.number_of_kids,
      killed_off: req.body.killed_off,
      description: req.body.description,
      house_id: req.body.house_id
    };

    const gotData = await client.query(`
    UPDATE got
      SET name=$1, image_url=$2, number_of_kids=$3, killed_off=$4, description=$5, house_id=$6
      WHERE got.id = $7
      RETURNING *
    `, [updatedCharacter.name, updatedCharacter.image_url, updatedCharacter.number_of_kids, updatedCharacter.killed_off, updatedCharacter.description, updatedCharacter.house_id, gotID]);

    res.json(gotData.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
