import { describe, expect, it, stub } from './spec.helpers';

import { link } from '.';

const mockFetch = (options = {}) => stub().returns(Promise.resolve({
  json: stub().returns(Promise.resolve(options.response || {}))
}));

describe('link()', () => {
  it('throws an error when not given a clientId', () => {
    const options = { clientSecret: '<secret>' };
    expect(() => link(options)).to.throw(Error);
  });

  it('throws an error when not given a clientSecret', () => {
    const options = { clientId: '<id>' };
    expect(() => link(options)).to.throw(Error);
  });

  it('does not throw an error when given both a clientId and clientSecret', () => {
    const options = { clientId: '<id>', clientSecret: '<secret>' };
    expect(() => link(options)).not.to.throw(Error);
  });

  describe('Project', () => {
    describe('#get()', () => {
      it('implicitly authenticates before making the request', async () => {
        const fetch = mockFetch();
        const options = { clientId: '<id>', clientSecret: '<secret>' };
        const dependencies = { fetch };
        const project = link(options, dependencies);
        const path = '/echo';
        const inputs = { message: 'Hello, world!' };

        await project.get(path, inputs);

        expect(fetch).to.have.been.calledWith('https://api.block.mason.link/oauth2/token');
      });

      it('throws an error when authentication fails', () => {
        const fetch = mockFetch({ response: { errors: [{ detail: 'A thing happened with that thing. You know.' }] } });
        const options = { clientId: '<id>', clientSecret: '<secret>' };
        const dependencies = { fetch };
        const project = link(options, dependencies);
        const path = '/echo';
        const inputs = { message: 'Hello, world!' };

        return expect(project.get(path, inputs)).to.eventually.be.rejectedWith(Error);
      });

      it('performs a fetch() against the requested path', async () => {
        const fetch = mockFetch();
        const options = { clientId: '<id>', clientSecret: '<secret>' };
        const dependencies = { fetch };
        const project = link(options, dependencies);
        const path = '/totalSupply';
        const inputs = {};

        await project.get(path, inputs);

        expect(fetch).to.have.been.calledWith('https://api.block.mason.link/v1/totalSupply');
      });
    });

    describe('#post()', () => {
      it('implicitly authenticates before making the request', async () => {
        const fetch = mockFetch();
        const options = { clientId: '<id>', clientSecret: '<secret>' };
        const dependencies = { fetch };
        const project = link(options, dependencies);
        const path = '/mint';
        const inputs = { amount: Number('12345'), to: '0x1010202030304040505000006060707080809090' };

        await project.post(path, inputs);

        expect(fetch).to.have.been.calledWith('https://api.block.mason.link/oauth2/token');
      });

      it('throws an error when authentication fails', () => {
        const fetch = mockFetch({ response: { errors: [{ detail: 'A thing happened with that thing. You know.' }] } });
        const options = { clientId: '<id>', clientSecret: '<secret>' };
        const dependencies = { fetch };
        const project = link(options, dependencies);
        const path = '/echo';
        const inputs = { message: 'Hello, world!' };

        return expect(project.post(path, inputs)).to.eventually.be.rejectedWith(Error);
      });

      it('performs a fetch() against the requested path', async () => {
        const fetch = mockFetch();
        const options = { clientId: '<id>', clientSecret: '<secret>' };
        const dependencies = { fetch };
        const project = link(options, dependencies);
        const path = '/echo';
        const inputs = { message: 'Hello, world!' };

        await project.post(path, inputs);

        expect(fetch).to.have.been.calledWith('https://api.block.mason.link/v1/echo');
      });
    });
  });
});
