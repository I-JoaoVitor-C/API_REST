const express = require('express'); 
const router = express.Router(); 
const fs = require('fs'); 
const caminho_de_dados = require('../data/jogos.json'); 

function lerArquivo() { 
    const dados = fs.readFileSync(caminho_de_dados, 'utf-8'); 
    return JSON.parse(dados); 
}; 
    
    // ——————————ROTA—PARA—LISTAR—TODOS—OS—JOGOS—(GET)——————————

router.get('/', (req, res) => {
    try {
        const jogos = lerArquivo();
        res.json(jogos);
    } catch (erro) {
        res.status(500).json({mensagem: "Erro ao ler os dados." });
    }
});