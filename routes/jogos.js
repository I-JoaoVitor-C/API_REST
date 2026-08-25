const express = require('express'); 
const router = express.Router(); 
const fs = require('fs'); 
const caminho_de_dados = './data/jogos.json'; 

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
        console.error("ERRO REAL NO TERMINAL:", erro);
        res.status(500).json({mensagem: "Erro ao ler os dados." });
    }
});

router.post('/', (req, res) => {
    try {
        const { id, nome, ano_lancamento, desenvolvedora, genero } = req.body;

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
            id: Date.now(),   // ← Date.now() serve para registrar o id com o momento em ms que o jogo foi  (para garantir que seja único).
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

// ——————————ROTA—PARA—BUSCAR—JOGO—POR—ID—(GET)—————————————

router.get('/:id', (req, res) => {

    try {
        const jogos = lerArquivo();
        const jogo = jogos.find(jogo_atual => jogo_atual.id == req.params.id);
    
        if (!jogo) {
            return res.status(404).json({mensagem: "Jogo não encontrado."});
        }

        res.json(jogo);
    } catch (erro) {
        res.status(500).json({mensagem: "Erro ao buscar jogo."})
    }
});

// ——————————ROTA—PARA—ATUALIZAR—JOGOS—(PUT)———————————————
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { nome, ano_lancamento, desenvolvedora, genero } = req.body;
        
        const jogos = lerArquivo(); 

        const index = jogos.findIndex(jogo_atual => jogo_atual.id == id);

        if (index === -1) {   // ← Diferente do python, o -1 não retorna o último item da lista, aqui se trata de um valor impossível, que não foi encontrado.
            return res.status(404).json({ mensagem: "Jogo não encontrado." });
        }

        // ↓ Atualiza o objeto na posição que ele foi encontrado.
        jogos[index] = {
            ...jogos[index], // ← O "..." mantém o que já existia e traz para nós aqui, serve muito bem para não complicar com o id.
            nome,   // ← js permite escrever por cima, ou seja, quem for o mais novo vai ter maior prioridade.
            ano_lancamento, 
            desenvolvedora,
            genero
        };

        // ↓ Aqui se salva as alterações.
        fs.writeFileSync(caminho_de_dados, JSON.stringify(jogos, null, 2));

        res.json(jogos[index]);

    } catch (error) {
        console.error("Erro detalhado:", error); 
        res.status(500).json({ mensagem: "Erro ao atualizar o jogo." });    }
});

// ——————————ROTA—PARA—EXCLUIR—JOGOS—(DELETE)———————————————
router.delete('/:id', (req, res) => {
    try {
        let jogos = lerArquivo();
        const index = jogos.findIndex(jogo_atual => jogo_atual.id == req.params.id); // ← Já explicado anteriormente.

        if (index === -1) {   // ← Já explicado anteriormente.
            return res.status(404).json({ mensagem: "Jogo não encontrado para exclusão." });
        }

        jogos.splice(index, 1);   // ← O splice serve para modificar a lista original, ali se diz: pegue o item pelo id tal e apague apenas 1 item a partir dele (ou seja, ele mesmo).
        fs.writeFileSync(caminho_de_dados, JSON.stringify(jogos, null, 2));

        res.json({ mensagem: "Jogo removido com sucesso!" });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao excluir o jogo." });
    }
});

module.exports = router;   // ← Exporta para que outros arquivos (nesse caso só o index.js) possam utilizar dele.