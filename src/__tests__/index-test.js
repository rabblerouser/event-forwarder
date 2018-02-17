'use strict';

const handler = require('../');

describe('handler', () => {
  let request;
  let callback;
  const event = { Records: [{ kinesis: "I'm a kinesis payload" }] };
  const console = { log: _ => _, warn: _ => _, error: _ => _ };

  beforeEach(() => {
    request = sinon.stub();
    callback = sinon.spy();
  })

  it('POSTs the event and succeeds when the POSTing succeeds', () => {
    request.returns(Promise.resolve());
    return handler(request, 'example.com/events', 'secret', console)(event, null, callback).then(() => {
      expect(request).to.have.been.calledWith({
        method: 'POST',
        uri: 'example.com/events',
        body: "I'm a kinesis payload",
        json: true,
        headers: {
          Authorization: 'secret',
        },
      });
      expect(callback).to.have.been.calledWith(null, 'ok')
    });
  });

  it('fails when POSTing fails', () => {
    request.returns(Promise.reject('Error!'));

    return handler(request, '', '', console)(event, null, callback).then(() => {
      expect(callback).to.have.been.calledWith('Error!');
    });
  });
});
