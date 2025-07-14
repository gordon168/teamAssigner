document.addEventListener('DOMContentLoaded', () => {
    const assignBtn = document.getElementById('assign-btn');
    const playerCountInput = document.getElementById('player-count');
    const teamSizeInput = document.getElementById('team-size');
    const playerCircle = document.querySelector('.player-circle');
    const teamsContainer = document.querySelector('.teams-container');
    const basketball = document.querySelector('.basketball');

    assignBtn.addEventListener('click', () => {
        const playerCount = parseInt(playerCountInput.value);
        const teamSize = parseInt(teamSizeInput.value);

        if (playerCount < 7) {
            alert('Total number of players must be bigger than 6.');
            return;
        }
        if (teamSize <= 0) {
            alert('Team size must be a positive number.');
            return;
        }

        assignTeams(playerCount, teamSize);
    });

    function assignTeams(playerCount, teamSize) {
        const players = Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`);
        players.sort(() => Math.random() - 0.5); // Shuffle players

        const teams = [];
        const teamCount = Math.ceil(playerCount / teamSize);

        for (let i = 0; i < teamCount; i++) {
            teams.push([]);
        }

        for (let i = 0; i < playerCount; i++) {
            teams[i % teamCount].push(players[i]);
        }

        renderPlayers(players);
        animateAssignment(teams, players);
    }

    function renderPlayers(players) {
        playerCircle.innerHTML = '';
        const radius = 140;
        const centerX = 150;
        const centerY = 150;
        const playerCount = players.length;

        for (let i = 0; i < playerCount; i++) {
            const angle = (i / playerCount) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle) - 30;
            const y = centerY + radius * Math.sin(angle) - 30;

            const playerEl = document.createElement('div');
            playerEl.classList.add('player');
            playerEl.style.left = `${x}px`;
            playerEl.style.top = `${y}px`;
            playerEl.dataset.player = players[i];
            playerEl.textContent = players[i].replace('Player ', '');
            playerCircle.appendChild(playerEl);
        }
    }

    function animateAssignment(teams, players) {
        teamsContainer.innerHTML = '';
        let playerIndex = 0;
        let teamIndex = 0;

        teams.forEach((team, i) => {
            const teamEl = document.createElement('div');
            teamEl.classList.add('team');
            teamEl.id = `team-${i}`;
            teamEl.innerHTML = `<h3>Team ${i + 1}</h3>`;
            teamsContainer.appendChild(teamEl);
        });

        function assignNextPlayer() {
            if (playerIndex >= players.length) {
                return; // All players assigned
            }

            const player = players[playerIndex];
            const playerEl = document.querySelector(`[data-player='${player}']`);

            const basketballRect = basketball.getBoundingClientRect();
            const playerRect = playerEl.getBoundingClientRect();
            const circleRect = playerCircle.getBoundingClientRect();

            const translateX = playerRect.left - circleRect.left - (basketballRect.width / 2) + (playerRect.width / 2);
            const translateY = playerRect.top - circleRect.top - (basketballRect.height / 2) + (playerRect.height / 2);

            basketball.style.transition = 'transform 1s ease-in-out';
            basketball.style.transform = `translate(${translateX}px, ${translateY}px) rotate(360deg)`;

            setTimeout(() => {
                playerEl.style.border = '3px solid #f08023';

                for (let i = 0; i < teams.length; i++) {
                    if (teams[i].includes(player)) {
                        const teamEl = document.getElementById(`team-${i}`);
                        teamEl.innerHTML += `${player} `;
                        break;
                    }
                }

                playerIndex++;
                setTimeout(assignNextPlayer, 500);
            }, 1000);
        }

        assignNextPlayer();
    }
});
