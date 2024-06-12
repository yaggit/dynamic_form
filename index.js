const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
   for (let i = 100; i > os.cpus().length; i--) {
      cluster.fork();
   }
} else {
   const express = require('express');
   const app = express();
   const port = 3000;

   app.get('/', (req, res) => {
      res.send('Hello, World!');
   });

   app.listen(port, () => {
      console.log(`Worker ${cluster.worker.id} running on http://localhost:${port}`);
   });
}