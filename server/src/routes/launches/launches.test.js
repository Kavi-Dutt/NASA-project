const request = require('supertest');
const app = require('../../app');
const {
    mongoConnect,
    mongoDisconnect,
} = require('../../services/mongo')

describe('Test launch API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /launches', () => {
        test('it should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-type', /json/)
                .expect(200)
        });
    });

    describe('Test Post /launches', () => {

        const completeLaunchData = {
            mission: 'Anant enterprises',
            rocket: 'PSLV 008',
            target: 'Kepler-62 f',
            launchDate: 'July 29, 2024',
        }

        const launchDataWithoutDate = {
            mission: 'Anant enterprises',
            rocket: 'PSLV 008',
            target: 'Kepler-62 f',
        }

        const launchDataWithInvaildDate = {
            mission: 'Anant enterprises',
            rocket: 'PSLV 008',
            target: 'kepler-62 b',
            launchDate: '29, 2024',
        }

        test('It should respond with 201 success', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
            const requestDate = new Date(completeLaunchData.launchDate).valueOf;
            const responseDate = new Date(response.body.launchDate).valueOf;
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });

        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'require details missing',
            })
        });

        test('It should catch invaild dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvaildDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'date is not proper',
            })
        });
    })
});
