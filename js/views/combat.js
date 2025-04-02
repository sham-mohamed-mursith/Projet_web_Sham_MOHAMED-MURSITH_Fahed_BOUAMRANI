export function renderCombat(provider) {
  const app = document.getElementById("app");
  app.innerHTML = `<div class="loader"></div>`;

  Promise.all([provider.getPersonnages(), provider.getEquipements()])
    .then(([personnages, equipements]) => {
      let selected1 = null;
      let selected2 = null;

      app.innerHTML = `
        <h2>Simuler un Combat</h2>
        <p>Choisissez deux personnages en cliquant sur leurs images.</p>
        <div class="characters-grid" id="fighters-grid"></div>
        <div style="text-align: center; margin: 20px;">
          <button id="fight-btn" disabled>⚔️ Combattre !</button>
        </div>
        <div id="combat-result" style="margin-top: 20px;"></div>
      `;

      const grid = document.getElementById("fighters-grid");

      personnages.forEach((perso) => {
        const card = document.createElement("div");
        card.classList.add("character-card");
        card.setAttribute("data-id", perso.id);

        card.innerHTML = `
          <img src="${perso.image}" alt="${perso.name}">
          <div class="character-info">
            <h2>${perso.name}</h2>
            <div class="character-meta">
              <span class="character-class">${perso.class}</span>
              <span class="character-level">Lv${perso.level}</span>
            </div>
            <div class="character-rating">
              <span>${perso.rating}</span> ⭐
            </div>
          </div>
        `;

        card.addEventListener("click", () => {
          const id = perso.id;

          if (!selected1 || selected1.id === id) {
            selected1 = selected1 && selected1.id === id ? null : perso;
          } else if (!selected2 || selected2.id === id) {
            selected2 = selected2 && selected2.id === id ? null : perso;
          } else {
            // Replace oldest selection
            selected1 = selected2;
            selected2 = perso;
          }

          updateSelection();
        });

        grid.appendChild(card);
      });

      function updateSelection() {
        const cards = document.querySelectorAll(".character-card");
        cards.forEach(card => {
          const id = card.getAttribute("data-id");
          card.classList.remove("selected-1", "selected-2");

          if (selected1 && id == selected1.id) {
            card.classList.add("selected-1");
          } else if (selected2 && id == selected2.id) {
            card.classList.add("selected-2");
          }
        });

        const btn = document.getElementById("fight-btn");
        btn.disabled = !(selected1 && selected2);
      }

      document.getElementById("fight-btn").addEventListener("click", () => {
        const score1 = calculerScore(selected1, equipements);
        const score2 = calculerScore(selected2, equipements);
        const result = document.getElementById("combat-result");

        if (score1 === score2) {
          result.innerHTML = `
            <h3>⚖️ Égalité !</h3>
            <p>${selected1.name} et ${selected2.name} ont tous les deux un score de ${score1.toFixed(1)}.</p>
          `;
        } else {
          const winner = score1 > score2 ? selected1 : selected2;
          const loser = score1 > score2 ? selected2 : selected1;
          result.innerHTML = `
            <h3>🏆 ${winner.name} a vaincu ${loser.name} !</h3>
            <p>Score ${selected1.name} : ${score1.toFixed(1)}</p>
            <p>Score ${selected2.name} : ${score2.toFixed(1)}</p>
          `;
        }
      });
    });
}

function calculerScore(personnage, equipements) {
  const level = personnage.level;
  const eq = (personnage.equipment || [])
    .map(id => equipements.find(e => e.id.toString() === id.toString()))
    .filter(Boolean);
  const damage = eq.reduce((sum, e) => sum + (e.damage || 0), 0);
  const defense = eq.reduce((sum, e) => sum + (e.defense || 0), 0);
  const chance = Math.random() * 10;

  return level * 2 + damage + defense + chance;
}
