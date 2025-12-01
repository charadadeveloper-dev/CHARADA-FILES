const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuração de uploads
const upload = multer({ dest: 'uploads/' });

// Arquivos estáticos
app.use(express.static('public'));

// Lista os arquivos enviados
function getFiles() {
    return fs.readdirSync('./uploads').map(fname => ({
        name: fname,
        url: '/file/' + encodeURIComponent(fname)
    }));
}

// Página principal hacker
app.get('/', (req, res) => {
    const files = getFiles();
    let fileList = files.map(file => `<li><a href="${file.url}" download>${file.name}</a></li>`).join('');
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>CHARADA FILES - Hacker Download</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container">
                <h1>OS MELHORES CHEATS VC ENCONTRA AQUI</h1>
                <ul class="download-list">${fileList || '<li>Nenhum arquivo disponível.</li>'}</ul>
                <a href="/admin" class="admin-link">Área Hacker (Admin)</a>
            </div>
            <footer>
                <span>&copy; CHARADA FILES | CÓDIGO É PODER</span>
            </footer>
        </body>
        </html>
    `);
});

// Página upload/admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Upload handler
app.post('/admin/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.send(`
            <div class="container">
                <h2>Falha no upload!</h2>
                <a href="/admin">Tentar novamente</a>
            </div>
        `);
    }
    res.send(`
        <div class="container">
            <h2>Arquivo enviado com sucesso!</h2>
            <a href="/">Voltar para principal</a>
        </div>
    `);
});

// Download dos arquivos
app.get('/file/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath, req.params.filename, err => {
        if (err) {
            res.status(404).send('Arquivo não encontrado.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor hacker rodando em http://localhost:${PORT}`);
});
