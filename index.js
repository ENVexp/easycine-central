import express from 'express';
import archiver from 'archiver';
import { clearText } from './utils.js';
import path from 'path';
import { generateLogin, getCategories, getMovies } from './service/data-service.js';
import axios from 'axios';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
//const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/movies', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'movies.html'));
});

app.get('/player', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'player.html'));
});

// API
app.get('/api/generateLogin', async (req, res) => {
    const response = await generateLogin();
    res.send(response);
});

app.get('/api/categories', async (req, res) => {
    console.log(req.query);
    const response = await getCategories(
        req.query.dns,
        req.query.username,
        req.query.password
    );
    res.send(response);
});

app.get('/api/movies', async (req, res) => {
    const response = await getMovies(
        req.query.dns,
        req.query.username,
        req.query.password
    );
    res.send(response);
});

app.get('/api/movie-download', async (req, res) => {
    try {
        const response = await axios(
            {
                url: `${req.query.dns}/movie/${req.query.username}/${req.query.password}/${req.query.id}.mp4`,
                method: "GET",
                responseType: "stream",
            }
        );
        Object.entries(response.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        res.setHeader("Content-Type", 'application/octet-stream');
        res.setHeader("Content-Disposition", `inline; filename="${req.query.name}.mp4"`);
        response.data.pipe(res);
    } catch (error) {
        console.error("Erro ao baixar ", error.message);
        res.status(500).send("Erro ao baixar");
    }
});

app.get('/api/movie-download-bot', async (req, res) => {
    try {
        const info = JSON.parse(decodeURIComponent(req.query.info));
        res.attachment(clearText(info.name) + '.zip');
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);
        const response = await axios(
            {
                url: `${req.query.dns}/movie/${req.query.username}/${req.query.password}/${info.stream_id}.mp4`,
                method: "GET",
                responseType: "stream",
            }
        );
        res.setHeader('Content-Type', 'application/zip');
        archive.append(JSON.stringify(info), { name: 'info.json' });
        archive.append(response.data, { name: info.stream_id + '.mp4' });
        archive.finalize();
    } catch (error) {
        console.error('Erro ao gerar arquivo', error);
        res.status(500).json({ error: 'Erro ao gerar arquivo' });
    }
});


export default app;
