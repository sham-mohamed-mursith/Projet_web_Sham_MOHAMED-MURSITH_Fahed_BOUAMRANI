// js/views/combat.js
export function renderCombat(provider) {
    const app = document.getElementById("app");
    app.innerHTML = `<div class="loader"></div>`;
  
    Promise.all([provider.getPersonnages(), provider.getEquipements()]).then(([personnages, equipements]) => {
      app.innerHTML = `
        <h2>Simuler un Combat</h2>
        <form id="combat-form">
          <label for="fighter1">Personnage 1 :</label>
          <select id="fighter1">${personnages.map(p => `<option value="${p.id}">${p.name}</option>`).join("")}</select>
  
          <label for="fighter2">Personnage 2 :</label>
          <select id="fighter2">${personnages.map(p => `<option value="${p.id}">${p.name}</option>`).join("")}</select>
  
          <button type="submit">Combattre !</button>
        </form>
        <div id="combat-result" style="margin-top: 20px;"></div>
      `;
  
      document.getElementById("combat-form").addEventListener("submit", (e) => {
        e.preventDefault();
      
        const id1 = document.getElementById("fighter1").value;
        const id2 = document.getElementById("fighter2").value;
      
        if (id1 === id2) {
          document.getElementById("combat-result").innerHTML = `<p>Choisissez deux personnages différents !</p>`;
          return;
        }
      
        const fighter1 = personnages.find(p => p.id.toString() === id1);
        const fighter2 = personnages.find(p => p.id.toString() === id2);
      
        if (!fighter1 || !fighter2) {
          document.getElementById("combat-result").innerHTML = `<p>Erreur : personnage non trouvé.</p>`;
          return;
        }
      
        const score1 = calculerScore(fighter1, equipements);
        const score2 = calculerScore(fighter2, equipements);
      
        const winner = score1 > score2 ? fighter1 : fighter2;
        const loser = score1 > score2 ? fighter2 : fighter1;
      
        document.getElementById("combat-result").innerHTML = `
          <h3>Résultat du combat</h3>
          <p>🏆 <strong>${winner.name}</strong> a vaincu ${loser.name} !</p>
          <p>Score ${fighter1.name} : ${score1.toFixed(2)}</p>
          <p>Score ${fighter2.name} : ${score2.toFixed(2)}</p>
        `;
      });
    }
    );
  }
  
  function calculerScore(personnage, equipements) {
    const level = personnage.level;
    const eq = (personnage.equipment || []).map(id => equipements.find(e => e.id.toString() === id.toString())).filter(Boolean);
    const damage = eq.reduce((sum, e) => sum + (e.damage || 0), 0);
    const defense = eq.reduce((sum, e) => sum + (e.defense || 0), 0);
  
    return level * 2 + damage + defense; // pondération simple
  }