const PsnProfileService = require('../src/main/PsnProfileService');

try {
    cors = require('cors');
    const express = require('express');
    // ... resto do seu código

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
            const { game } = req.params;
            const games = await PsnProfileService.getGameByName(game);
            
            return res.status(200).json(games);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar jogos' });
        }
    });
    } catch (e) {
    console.error("ERRO DE IMPORTAÇÃO:", e.message);
}

// IMPORTANTE PARA VERCEL: Exportar o app em vez de dar app.listen()
module.exports = app;