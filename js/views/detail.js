export function renderDetail(provider, id) {
  const app = document.getElementById("app");
  app.innerHTML = `<div class="loader"></div>`;

  provider.getPersonnageById(id).then(personnage => {
    provider.getEquipements().then(equipementsList => {
      const equipements = (personnage.equipment || [])
        .map(eid => equipementsList.find(eq => eq.id.toString() === eid.toString()))
        .filter(e => e);

      app.innerHTML = `
        <div class="details-content">
          <img src="${personnage.image}" alt="${personnage.name}" class="character-image">
          <div class="character-details-info">
            <h2>${personnage.name}</h2>
            <p><strong>Classe:</strong> ${personnage.class}</p>
            <p><strong>Niveau:</strong> ${personnage.level}</p>
            <p><strong>Note:</strong> ${personnage.rating} ⭐</p>

            ${equipements.length > 0 ? `
              <div class="equipment-list">
                <h3>Équipements (${equipements.length})</h3>
                ${equipements.map(equip => `
                  <div class="equipment-item">
                    <div>
                      <strong>${equip.name}</strong>
                      ${equip.damage ? `<p>Dégâts: ${equip.damage}</p>` : ''}
                      ${equip.defense ? `<p>Défense: ${equip.defense}</p>` : ''}
                      ${equip.effect ? `<p>Effet: ${equip.effect}</p>` : ''}
                    </div>
                    <span class="equipment-type">${equip.type}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            <div class="notation">
              <h3>Noter ${personnage.name}</h3>
              <label for="rating-input">Votre note (1 à 5) :</label>
              <input type="number" id="rating-input" min="1" max="5" step="0.1" value="${personnage.rating}">
              <button id="valider-note">Valider la note</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById("valider-note").addEventListener("click", async () => {
        const newRating = parseFloat(document.getElementById("rating-input").value);
        if (newRating >= 1 && newRating <= 5) {
          try {
            await provider.updatePersonnageRating(personnage.id, newRating);
            alert("Note mise à jour !");
            window.location.reload();
          } catch (err) {
            alert("Erreur lors de la mise à jour.");
          }
        } else {
          alert("Merci d'entrer une note entre 1 et 5.");
        }
      });
    });
  });
}
