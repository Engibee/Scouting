const playerList = document.getElementById('player-list');
const searchInput = document.getElementById('search');
const teamFilter = document.getElementById('team-filter');

let players = [];
let selectedSport = '';
let selectedTeam = '';

// Função para buscar jogadores da API e armazenar na variável "players"
async function fetchPlayers() {
    const response = await fetch('http://127.0.0.1:8000/jogadores');
    players = await response.json();
}

// Função para preencher o filtro de times com base no esporte selecionado
function updateTeamFilter() {
    teamFilter.innerHTML = '<option value="">Todos os Times</option>';

    // Filtra times únicos com base no esporte selecionado
    const teams = [...new Set(players
        .filter(player => player.esporte.toLowerCase() === selectedSport.toLowerCase())
        .map(player => player.equipe)
    )];
    
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamFilter.appendChild(option);
    });
}

// Função para exibir jogadores de acordo com o esporte e time selecionados
function displayPlayers() {
    playerList.innerHTML = '';

    // Filtra jogadores por esporte e time
    const filteredPlayers = players.filter(player => {
        const matchesSport = selectedSport ? player.esporte.toLowerCase() === selectedSport.toLowerCase() : true;
        const matchesTeam = selectedTeam ? player.equipe === selectedTeam : true;
        return matchesSport && matchesTeam;
    });

    if (filteredPlayers.length === 0) {
        playerList.innerHTML = '<p>Nenhum jogador encontrado.</p>';
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
                <p><strong>Esporte:</strong> ${player.esporte}</p>
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
        (selectedSport ? player.esporte.toLowerCase() === selectedSport.toLowerCase() : true) &&
        (selectedTeam ? player.equipe === selectedTeam : true)
    );
    displayFilteredPlayers(filteredPlayers);
}

// Event Listeners
document.getElementById('futebol').addEventListener('click', () => {
    selectedSport = 'futebol';
    selectedTeam = '';
    updateTeamFilter();  // Atualiza o filtro de times para exibir apenas os times de futebol
    displayPlayers();
});

document.getElementById('basquete').addEventListener('click', () => {
    selectedSport = 'basquete';
    selectedTeam = '';
    updateTeamFilter();  // Atualiza o filtro de times para exibir apenas os times de basquete
    displayPlayers();
});

searchInput.addEventListener('input', filterPlayers);

teamFilter.addEventListener('change', () => {
    selectedTeam = teamFilter.value;
    displayPlayers();
});

// Carregar todos os jogadores ao iniciar
fetchPlayers();
