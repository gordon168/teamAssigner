document.addEventListener('DOMContentLoaded', () => {
    const assignBtn = document.getElementById('assign-btn');
    const playerCountInput = document.getElementById('player-count');
    const playerCircle = document.querySelector('.player-circle');
    const teamsContainer = document.querySelector('.teams-container');
    const basketball = document.querySelector('.basketball');

    assignBtn.addEventListener('click', () => {
        const playerCount = parseInt(playerCountInput.value);
        if (playerCount < 7) {
            alert('Total number of players must be bigger than 6.');
            return;
        }
        assignTeams(playerCount);
    });

    function assignTeams(playerCount) {
        const players = Array.from({ length: playerCount }, (_, i) => i + 1);
        players.sort(() => Math.random() - 0.5); // Shuffle players

        const teams = [];
        let remainingPlayers = playerCount;

        while (remainingPlayers > 0) {
            let teamSize;
            if (remainingPlayers % 4 === 0) {
                teamSize = 4;
            } else if (remainingPlayers % 4 === 1) {
                if (remainingPlayers >= 5) {
                    teamSize = 5;
                } else {
                    teamSize = 3; // Should not happen with playerCount > 6
                }
            } else if (remainingPlayers % 4 === 2) {
                if (remainingPlayers >= 6) {
                    teamSize = 3;
                } else {
                    teamSize = 4; // Should not happen with playerCount > 6
                }
            } else { // remainingPlayers % 4 === 3
                teamSize = 3;
            }

            if (remainingPlayers - teamSize < 0) {
                teamSize = remainingPlayers;
            }

            const team = players.splice(0, teamSize);
            teams.push(team);
            remainingPlayers -= teamSize;
        }

        renderPlayers(playerCount);
        animateAssignment(teams);
    }

    function renderPlayers(playerCount) {
        playerCircle.innerHTML = '';
        const radius = 140;
        const centerX = 150;
        const centerY = 150;

        for (let i = 0; i < playerCount; i++) {
            const angle = (i / playerCount) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle) - 30;
            const y = centerY + radius * Math.sin(angle) - 30;

            const playerEl = document.createElement('div');
            playerEl.classList.add('player');
            playerEl.style.left = `${x}px`;
            playerEl.style.top = `${y}px`;
            playerEl.dataset.player = i + 1;
            playerEl.textContent = i + 1;
            playerCircle.appendChild(playerEl);
        }
    }

    function animateAssignment(teams) {
        teamsContainer.innerHTML = '';
        let teamIndex = 0;
        let playerIndex = 0;

        function assignNextPlayer() {
            if (teamIndex >= teams.length) {
                return; // All teams assigned
            }

            const team = teams[teamIndex];
            const player = team[playerIndex];
            const playerEl = document.querySelector(`[data-player='${player}']`);

            const basketballRect = basketball.getBoundingClientRect();
            const playerRect = playerEl.getBoundingClientRect();
            const circleRect = playerCircle.getBoundingClientRect();

            const translateX = playerRect.left - circleRect.left - (basketballRect.width / 2) + (playerRect.width / 2);
            const translateY = playerRect.top - circleRect.top - (basketballRect.height / 2) + (playerRect.height / 2);

            basketball.style.animation = 'roll 1s linear infinite';
            basketball.style.transform = `translate(${translateX}px, ${translateY}px)`;

            setTimeout(() => {
                basketball.style.animation = '';
                playerEl.style.border = '3px solid #f08023';

                let teamEl = document.getElementById(`team-${teamIndex}`);
                if (!teamEl) {
                    teamEl = document.createElement('div');
                    teamEl.classList.add('team');
                    teamEl.id = `team-${teamIndex}`;
                    teamEl.innerHTML = `<h3>Team ${teamIndex + 1}</h3>`;
                    teamsContainer.appendChild(teamEl);
                }
                teamEl.innerHTML += `Player ${player} `;

                playerIndex++;
                if (playerIndex >= team.length) {
                    playerIndex = 0;
                    teamIndex++;
                }

                setTimeout(assignNextPlayer, 500);
            }, 1000);
        }

        assignNextPlayer();
    }
});
