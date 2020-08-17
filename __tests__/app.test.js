require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  beforeAll(done => {
    return client.connect(done);
  });

  beforeEach(() => {
    // TODO: ADD DROP SETUP DB SCRIPT
    execSync('npm run setup-db');
  });

  afterAll(done => {
    return client.end(done);
  });

  test('returns got', async() => {

    const expectation = [
      {
        id: 1,
        name: 'Ned Stark',
        image_url: 'https://vignette.wikia.nocookie.net/gameofthrones/images/3/34/Eddard_Stark.jpg/revision/latest?cb=20190701140812',
        number_of_kids: 5,
        killed_off: true,
        house: 'Stark',
        description: 'Ned is the head of House Stark, Lord of Winterfell, and Warden of the North. He is a close friend to King Robert I Baratheon, with whom he was raised.',
        owner_id: 1
      },
      {
        id: 2,
        name: 'Jon Snow',
        image_url:'https://vignette.wikia.nocookie.net/gameofthrones/images/d/d0/JonSnow8x06.PNG/revision/latest?cb=20190714094440',
        number_of_kids: 0,
        killed_off: false,
        house: 'Stark',
        description: 'Jon Snow is the bastard son of Eddard Stark, Lord of Winterfell. He has five half-siblings: Robb, Sansa, Arya, Bran, and Rickon Stark. Unaware of the identity of his mother, Jon was raised at Winterfell. At the age of fourteen, he joins the Night\'s Watch, where he earns the nickname Lord Snow.',
        owner_id: 1
      },
      {
        id: 3,
        name: 'Tyrion Lannister',
        image_url: 'https://vignette.wikia.nocookie.net/gameofthrones/images/9/95/HandoftheKingTyrionLannister.PNG/revision/latest?cb=20190520175204',
        number_of_kids: 0,
        killed_off: false,
        house: 'Lannister',
        description: 'Tyrion Lannister is a member of House Lannister and is the third and youngest child of Lord Tywin Lannister and the late Lady Joanna Lannister. His older siblings are Cersei Lannister, the queen of King Robert I Baratheon, and Ser Jaime Lannister, a knight of Robert\'s Kingsguard.Tyrion is a dwarf; because of this he is sometimes called the Imp and the Halfman.',
        owner_id: 1
      },
      {
        id: 4,
        name: 'Cersei Lannister',
        image_url: 'https://vignette.wikia.nocookie.net/gameofthrones/images/b/b0/CERSEIBATTLEOFKINGSLANDING.PNG/revision/latest?cb=20190906021534',
        number_of_kids: 3,
        killed_off: true,
        house: 'Lannister',
        description: 'Queen Cersei Lannister is the only daughter and eldest child of Lord Tywin Lannister of Casterly Rock and his wife, Lady Joanna Lannister. She is the twin of her younger brother, Ser Jaime Lannister. After Robert\'s Rebellion, Cersei married King Robert I Baratheon and became Queen of the Seven Kingdoms. She is the mother of Prince Joffrey, Princess Myrcella, and Prince Tommen of House Baratheon of King\'s Landing.',
        owner_id: 1
      },
      {
        id: 5,
        name: 'Daenerys Targaryen',
        image_url: 'https://vignette.wikia.nocookie.net/gameofthrones/images/f/fc/705_Daenerys_Painted_Table.jpg/revision/latest?cb=20170812013711',
        number_of_kids: 1,
        killed_off: true,
        house: 'Targaryen',
        description: 'Princess Daenerys Targaryen, also known as Daenerys Stormborn,[1] is one of the last confirmed members of House Targaryen, along with her older brother Viserys, who refers to her as Dany. She is the youngest child of King Aerys II Targaryen and his sister-wife, Queen Rhaella.',
        owner_id: 1
      }
    ];

    const data = await fakeRequest(app)
      .get('/got')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(data.body).toEqual(expectation);
  });
});
