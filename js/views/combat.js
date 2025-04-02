export function renderCombat(provider) {
  const app = document.getElementById("app");
  app.innerHTML = `<div class="loader"></div>`;

  Promise.all([provider.getPersonnages(), provider.getEquipements()])
    .then(([personnages, equipements]) => {
      app.innerHTML = `
        <h2>Simuler un Combat</h2>
        <form id="combat-form">
          <label for="fighter1">Personnage 1 :</label>
          <select id="fighter1">
            ${personnages.map(p => `<option value="${p.id}">${p.name}</option>`).join("")}
          </select>

          <label for="fighter2">Personnage 2 :</label>
          <select id="fighter2">
            ${personnages.map(p => `<option value="${p.id}">${p.name}</option>`).join("")}
          </select>

          <button type="submit">Combattre !</button>
        </form>
        <div id="combat-result" style="margin-top: 20px;"></div>
      `;

      document.getElementById("combat-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const id1 = document.getElementById("fighter1").value;
        const id2 = document.getElementById("fighter2").value;

        if (id1 === id2) {
          document.getElementById("combat-result").innerHTML = `<p>❌ Choisissez deux personnages différents !</p>`;
          return;
        }

        const fighter1 = personnages.find(p => p.id.toString() === id1);
        const fighter2 = personnages.find(p => p.id.toString() === id2);

        const score1 = calculerScore(fighter1, equipements);
        const score2 = calculerScore(fighter2, equipements);

        const resultDiv = document.getElementById("combat-result");

        if (score1 > score2) {
          resultDiv.innerHTML = `
            <h3>Résultat du combat</h3>
            <p>🏆 <strong>${fighter1.name}</strong> a vaincu ${fighter2.name} !</p>
            <p>Score ${fighter1.name} : ${score1}</p>
            <p>Score ${fighter2.name} : ${score2}</p>
          `;
        } else if (score2 > score1) {
          resultDiv.innerHTML = `
            <h3>Résultat du combat</h3>
            <p>🏆 <strong>${fighter2.name}</strong> a vaincu ${fighter1.name} !</p>
            <p>Score ${fighter1.name} : ${score1}</p>
            <p>Score ${fighter2.name} : ${score2}</p>
          `;
        } else {
          resultDiv.innerHTML = `
            <h3>Résultat du combat</h3>
            <p>⚔️ Égalité parfaite entre <strong>${fighter1.name}</strong> et <strong>${fighter2.name}</strong> !</p>
            <p>Score : ${score1}</p>
          `;
        }
      });
    });
}

function calculerScore(personnage, equipementsList) {
  let score = personnage.level * 2;

  if (personnage.equipment) {
    personnage.equipment.forEach(eid => {
      const equip = equipementsList.find(e => e.id == eid);
      if (equip) {
        if (equip.damage) score += equip.damage;
        if (equip.defense) score += equip.defense;
      }
    });
  }

  const chance = Math.floor(Math.random() * 21);
  return score + chance;
}
