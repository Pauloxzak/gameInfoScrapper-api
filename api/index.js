const express = require('express');
const cors = require('cors');

// 1. Inicializa o app PRIMEIRO para garantir que ele exista
const app = express();

app.use(cors());
app.use(express.json());

// 2. Importação segura do seu Service
let PsnProfileService;
try {
    // Note que usamos o caminho relativo para onde o arquivo JS está
    PsnProfileService = require('../src/main/PsnProfileService'); 
    } catch (e) {
    console.error("ERRO CRÍTICO NO SERVICE:", e.message);
    // Criamos um mock básico para evitar que a API quebre se o arquivo não for achado
    PsnProfileService = { getProfile: () => { throw new Error("Service não encontrado no caminho correto."); } };
}

// Endpoint para buscar o perfil completo
app.get('/api/psn/profile/:username', async (req, res) => {
    try {
        const { username } = req.params;
        
        // Chamando a função do seu serviço
        const profileData = await PsnProfileService.getProfile(username);
        
        return res.status(200).json(profileData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar perfil PSN' });
    }
});

// Endpoint para buscar apenas os jogos
app.get('/api/getGameByName', async (req, res) => {
    try {
        const { game } = req.query;
        const games = await PsnProfileService.getGameByName(game);
        
        return res.status(200).json(games);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar jogos' });
    }
});
    

// IMPORTANTE PARA VERCEL: Exportar o app em vez de dar app.listen()
module.exports = app;