const playerList = document.getElementById('player-list');
const searchInput = document.getElementById('search');

let players = [];
let selectedSport = ''; // Variável para armazenar o esporte selecionado

// Função para buscar jogadores da API
async function fetchPlayers() {
    const response = await fetch('http://127.0.0.1:8000/jogadores');
    players = await response.json();
    displayPlayers(); // Exibe os jogadores após o carregamento
}

// Função para exibir jogadores de acordo com o esporte selecionado
function displayPlayers() {
    playerList.innerHTML = '';
    
    // Filtrar jogadores com base no esporte selecionado
    const filteredPlayers = selectedSport ? players.filter(player => player.esporte.toLowerCase() === selectedSport.toLowerCase()) : players;

    // Se não houver jogadores filtrados, exibir mensagem
    if (filteredPlayers.length === 0) {
        playerList.innerHTML = '<p>Nenhum jogador encontrado para este esporte.</p>';
        return;
    }

    // Exibir jogadores filtrados
    filteredPlayers.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <div class="player-header">
                <img src="https://via.placeholder.com/100" alt="${player.nome}" class="player-photo">
                <h3 class="player-name">${player.nome}</h3>
            </div>
            <div class="player-info">
                <p><strong>Time:</strong> ${player.equipe}</p>
                <p><strong>Posição:</strong> ${player.posicao}</p>
                <p><strong>Altura:</strong> ${player.altura} m</p>
                <p><strong>Peso:</strong> ${player.peso} kg</p>
            </div>
            <button class="info-toggle">Mostrar mais informações</button>
            <div class="additional-info" style="display: none;">
                <p><strong>Gols/Cestas na Temporada:</strong> ${player.golsecestas_temporada}</p>
                <p><strong>Assistências na Temporada:</strong> ${player.assistencias_temporada}</p>
                <p><strong>Jogos Disputados:</strong> ${player.jogos_disputados}</p>
                <p><strong>Minutos Jogados:</strong> ${player.minutos_jogados}</p>
                <p><strong>Força:</strong> ${player.forca}</p>
                <p><strong>Agilidade:</strong> ${player.agilidade}</p>
                <p><strong>Velocidade:</strong> ${player.velocidade}</p>
                <p><strong>Resistência:</strong> ${player.resistencia}</p>
                <p><strong>Controle de Bola:</strong> ${player.controle_bola}</p>
            </div>
        `;
        
        // Adiciona a funcionalidade do dropdown
        const toggleButton = card.querySelector('.info-toggle');
        const additionalInfo = card.querySelector('.additional-info');
        toggleButton.addEventListener('click', () => {
            const isVisible = additionalInfo.style.display === 'block';
            additionalInfo.style.display = isVisible ? 'none' : 'block';
            toggleButton.textContent = isVisible ? 'Mostrar mais informações' : 'Ocultar informações';
        });

        playerList.appendChild(card);
    });
}

// Função para filtrar jogadores pelo nome
function filterPlayers() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPlayers = players.filter(player => 
        player.nome.toLowerCase().includes(searchTerm) && 
        (selectedSport ? player.esporte.toLowerCase() === selectedSport.toLowerCase() : true)
    );
    displayFilteredPlayers(filteredPlayers);
}

// Função para exibir jogadores filtrados
function displayFilteredPlayers(filteredPlayers) {
    playerList.innerHTML = '';
    if (filteredPlayers.length === 0) {
        playerList.innerHTML = '<p>Nenhum jogador encontrado com esse nome.</p>';
        return;
    }
    filteredPlayers.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <div class="player-header">
                <img src="https://via.placeholder.com/100" alt="${player.nome}" class="player-photo">
                <h3 class="player-name">${player.nome}</h3>
            </div>
            <div class="player-info">
                <p><strong>Time:</strong> ${player.equipe}</p>
                <p><strong>Posição:</strong> ${player.posicao}</p>
                <p><strong>Altura:</strong> ${player.altura} m</p>
                <p><strong>Peso:</strong> ${player.peso} kg</p>
            </div>
            <button class="info-toggle">Mostrar mais informações</button>
            <div class="additional-info" style="display: none;">
                <p><strong>Gols/Cestas na Temporada:</strong> ${player.golsecestas_temporada}</p>
                <p><strong>Assistências na Temporada:</strong> ${player.assistencias_temporada}</p>
                <p><strong>Jogos Disputados:</strong> ${player.jogos_disputados}</p>
                <p><strong>Minutos Jogados:</strong> ${player.minutos_jogados}</p>
                <p><strong>Força:</strong> ${player.forca}</p>
                <p><strong>Agilidade:</strong> ${player.agilidade}</p>
                <p><strong>Velocidade:</strong> ${player.velocidade}</p>
                <p><strong>Resistência:</strong> ${player.resistencia}</p>
                <p><strong>Controle de Bola:</strong> ${player.controle_bola}</p>
            </div>
        `;
        
        // Adiciona a funcionalidade do dropdown
        const toggleButton = card.querySelector('.info-toggle');
        const additionalInfo = card.querySelector('.additional-info');
        toggleButton.addEventListener('click', () => {
            const isVisible = additionalInfo.style.display === 'block';
            additionalInfo.style.display = isVisible ? 'none' : 'block';
            toggleButton.textContent = isVisible ? 'Mostrar mais informações' : 'Ocultar informações';
        });

        playerList.appendChild(card);
    });
}

// Event Listeners
document.getElementById('futebol').addEventListener('click', () => {
    selectedSport = 'futebol'; // Define o esporte como futebol
    displayPlayers(); // Exibe os jogadores após selecionar
});

document.getElementById('basquete').addEventListener('click', () => {
    selectedSport = 'basquete'; // Define o esporte como basquete
    displayPlayers(); // Exibe os jogadores após selecionar
});

searchInput.addEventListener('input', filterPlayers);

// Carregar todos os jogadores ao iniciar
fetchPlayers();
