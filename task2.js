const EventEmitter = require('events');
const http = require('http');
const { Readable } = require('stream');

class WithTime extends EventEmitter {
  async execute(asyncFunc, ...args) {
    try {
      this.emit('start');
      console.log('Execution started');
      const startTime = Date.now();
      const data = await asyncFunc(...args);
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      console.log(`Time taken: ${timeTaken}ms`);
      this.emit('end');
      console.log('Execution completed');

      const options = {
        hostname: 'jsonplaceholder.typicode.com',
        port: 80,
        path: '/posts/1',
        method: 'GET',
      };

      const req = http.request(options, (res) => {
        const readable = new Readable({
          objectMode: true,
          read() {
            res.on('data', (chunk) => {
              this.emit('data', chunk);
              this.push(chunk);
            });
            res.on('end', () => {
              this.emit('endData');
              this.push(null);
            });
          },
        });

        res.on('error', (error) => {
          this.emit('httpError', error);
          console.error(error);
        });

        return readable;
      });

      req.on('error', (error) => {
        this.emit('httpError', error);
        console.error(error);
      });

      req.end();
    } catch(error) {
      this.emit('error', error);
      console.error(error);
    }
  }
}

const withTime = new WithTime();
const asyncFunc = async () => {
    return 'some data';
  };
withTime.execute(asyncFunc);

module.exports = WithTime;