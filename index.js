import http from 'http';
import express from 'express';
import path from 'path';

const app = express();
const server = http.createServer(app);

port = 3000;
app.use(express.static(path.resolve('./public')));
server.listen(port,()=> console.log(`Http server is running on PORT ${port}`));