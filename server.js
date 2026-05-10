const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

cloudinary.config({
    cloud_name: 'dafzwf4xs', 
    api_key: '592181857286335', 
    api_secret: 'fayy1KysPKO4J5rhWfRnCUEixy8' 
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'spotify_clone', resource_type: 'auto' }
});
const upload = multer({ storage: storage });

mongoose.connect('mongodb://127.0.0.1:27017/spotify')
    .then(() => console.log("✅ DB Connected"))
    .catch(err => console.log(err));

const Song = mongoose.model('Song', new mongoose.Schema({
    name: String, artist: String, cover: String, url: String
}));

app.post('/api/upload-full', upload.fields([{ name: 'audio' }, { name: 'cover' }]), async (req, res) => {
    try {
        const newSong = new Song({
            name: req.body.name,
            artist: req.body.artist,
            url: req.files.audio[0].path,  
            cover: req.files.cover[0].path 
        });
        await newSong.save();
        res.status(200).send("Done!");
    } catch (e) { res.status(500).send(e.message); }
});

app.get('/api/songs', async (req, res) => {
    const songs = await Song.find();
    res.json(songs);
});

app.listen(5000, () => console.log("🚀 Server: http://localhost:5000"));