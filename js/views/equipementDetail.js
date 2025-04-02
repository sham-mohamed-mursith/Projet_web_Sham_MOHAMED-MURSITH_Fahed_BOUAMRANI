export function renderEquipementDetail(provider, id) {
  const app = document.getElementById("app");
  app.innerHTML = `<div class="loader"></div>`;

  provider.getEquipements().then(equipements => {
    const equipement = equipements.find(e => e.id.toString() === id.toString());

    if (!equipement) {
      app.innerHTML = `<p class="error-message">Équipement introuvable.</p>`;
      return;
    }

    app.innerHTML = `
      <div class="details-content">
        <img src="${equipement.image}" alt="${equipement.name}" class="character-image">
        <div class="character-details-info">
          <h2>${equipement.name}</h2>
          <p><strong>Type:</strong> ${equipement.type}</p>
          ${equipement.damage ? `<p><strong>Dégâts:</strong> ${equipement.damage}</p>` : ""}
          ${equipement.defense ? `<p><strong>Défense:</strong> ${equipement.defense}</p>` : ""}
          ${equipement.effect ? `<p><strong>Effet:</strong> ${equipement.effect}</p>` : ""}
        </div>
      </div>
    `;
  });
}
