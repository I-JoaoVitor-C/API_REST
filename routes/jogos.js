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

router.post('/', (req, res) => {
    try {
        const { id, nome, desenvolvedora, genero, ano_lancamento} = req.body;

        // ↓ Verificando a entrada, pois, nome e ano_lancamento são obrigatórios.
        if (!nome || ano_lancamento === undefined) {   // ← "!" expressa oposto, nulo ou indefinido. "||" expressa "ou". "===" expressa igualdade de tipo de dado e de valor de entrada.
            return res.status(400).json({ mensagem: "Nome, ano de lançamento e desenvolvedora são campos obrigatórios." });
        }

        // ↓ Verificando a entrada, pois, ano_lancamento deve ser obrigatóriamente um int. 
        if (!Number.isInteger(ano_lancamento)) {   // ← "!==" expressa desigualdade de tipo de dado e de valor de entrada.
            return res.status(400).json({ mensagem: "O ano de lançamento do jogo deve ser um número inteiro." });
        }

        const jogos = lerArquivo();

        // ↓ Criando objeto (id automaticamente gerado)
        const novoJogo = {
            id: Date.now(),   // ← Date.now() serve para registrar o id com o momento em ms que o jogo foi registrado (para garantir que seja único).
            nome,   // ← Importante lembrar, quando o nome da propriedade e da variavel for a mesma, não precisa repetir.
            ano_lancamento,
            desenvolvedora: desenvolvedora|| "",
            genero: genero || "Geral"
        };

        jogos.push(novoJogo);   // ← Vai adicionar o que foi entrado ao final do arquivo json.
        fs.writeFileSync(caminho_de_dados, JSON.stringify(jogos, null, 2));   // ← Aqui serve para salvar o que foi feito.

        res.status(201).json(novoJogo);   // ← Código 201 quer dizer que deu tudo certo, está ok.
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao salvar o jogo." });
    }
    
});