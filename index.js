import http from 'http';
import express from 'express';
import path from 'path';

const app = express();
const server = http.createServer(app);

app.use(express.static(path.resolve('./public')));
server.listen(300,()=> console.log(`Http server is running on PORT 3000`));