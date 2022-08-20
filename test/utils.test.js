import chai from 'chai';
import chaiHttp from 'chai-http';
import { sendEmail, checkPermission, cloudinary } from '../src/utils/index.js';

chai.use(chaiHttp);
const host = 'http://localhost:5000';

describe('Unit test', async () => {
  it('should return a status code of 401', () => {
    const userId = '62f6477745ca76dc8f5832d7';
    const responseId = '62f6477745ca76dc8f5832d3';
    const req = { user: { role: 'user' } };

    try {
      checkPermission(req, userId, responseId);
    } catch (error) {
      chai.expect(error.statusCode).to.equal(401);
    }
  });

  it('should return an object', async () => {
    const emailFields = {
      to: 'ebraboke@gmail.com',
      subject: 'Testing ...',
      text: 'Testing...',
    };

    const message = await sendEmail(emailFields);
    chai.expect(message).to.be.an('object');
  }).timeout(20000);
});
