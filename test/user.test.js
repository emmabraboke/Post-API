import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const host = 'http://localhost:5000';

describe('User Integration test', () => {
  //retains cookie in each request
  const agent = chai.request.agent(host);
  it('should return status code of 200', async () => {
    const res = await agent.post('/user/signIn').send({
      username: 'emmaspi',
      password: '123567',
    });

    console.log(res);
    chai.expect(res.status).to.equal(200);
  }).timeout(20000);

  it('should return status code of 200', async () => {
    const res = await agent.get('/user');
    chai.expect(res.status).to.equal(200);
  }).timeout(20000);

  it('should return status code of 500', async () => {
    const res = await agent.get('/user/1');
    chai.expect(res.status).to.equal(500);
  }).timeout(20000);
});
