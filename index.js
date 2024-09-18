import http from 'http';
import path from 'path';
import { spawn } from 'child_process';
import express from 'express';
import { Server as SocketIO } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const RTMP_URL = 'rtmp://a.rtmp.youtube.com/live2/vez9-w88p-56tu-gfh7-7mxd';

const options = [
    '-i',
    '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', '25',
    '-g', '50', // 2 times the frame rate
    '-keyint_min', '25',
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '32000', // Adjusted to a common value
    '-f', 'flv',
    RTMP_URL,
];

const ffmpegProcess = spawn('ffmpeg', options);

ffmpegProcess.stdout.on('data', (data) => {
    console.log(`ffmpeg stdout: ${data.toString()}`);
});

ffmpegProcess.stderr.on('data', (data) => {
    console.error(`ffmpeg stderr: ${data.toString()}`);
});

ffmpegProcess.on('error', (err) => {
    console.error(`ffmpeg process error: ${err}`);
});

ffmpegProcess.on('close', (code) => {
    console.log(`ffmpeg process exited with code ${code}`);
});

app.use(express.static(path.resolve('./public')));

io.on('connection', (socket) => {
    console.log('Socket Connected', socket.id);

    socket.on('binarystream', (stream) => {
        console.log('Binary Stream Incoming...');
        ffmpegProcess.stdin.write(stream, (err) => {
            if (err) {
                console.error('Error writing to ffmpeg stdin:', err);
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Socket Disconnected', socket.id);
    });
});

server.listen(3000, () => {
    console.log(`HTTP Server is running on PORT 3000`);
});
