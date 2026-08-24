const express = require('express');
const app = express();
const jogosRoutes = require('./routes/jogos');

app.use(express.json());

app.use('/jogos', jogosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server funcionando corretamente em http://localhost:${PORT}/jogos`);
});