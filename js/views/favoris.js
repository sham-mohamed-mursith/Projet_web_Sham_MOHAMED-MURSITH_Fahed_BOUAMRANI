export function renderFavoris(provider) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h2>Personnages favoris</h2>
    <div class="characters-grid" id="favoris-container"><div class="loader"></div></div>
    <h2>Équipements favoris</h2>
    <div class="characters-grid" id="equipements-favoris-container"><div class="loader"></div></div>
  `;

  const favoris = JSON.parse(localStorage.getItem("favoris")) || [];
  const favorisEquipements = JSON.parse(localStorage.getItem("favorisEquipements")) || [];

  provider.getPersonnages().then(personnages => {
    const container = document.getElementById("favoris-container");
    container.innerHTML = "";

    const favorisPersos = personnages.filter(p => favoris.includes(p.id));

    if (favorisPersos.length === 0) {
      container.innerHTML = "<p>Aucun personnage en favori.</p>";
      return;
    }

    favorisPersos.forEach((perso, index) => {
      setTimeout(() => {
        const card = document.createElement("div");
        card.classList.add("character-card", "fade-in");
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
        card.querySelector("img").addEventListener("click", () => {
          window.location.hash = `#/detail/${perso.id}`;
        });
        container.appendChild(card);
      }, index * 50);
    });
  });

  provider.getEquipements().then(equipements => {
    const container = document.getElementById("equipements-favoris-container");
    container.innerHTML = "";

    const favorisEquips = equipements.filter(e => favorisEquipements.includes(e.id));

    if (favorisEquips.length === 0) {
      container.innerHTML = "<p>Aucun équipement en favori.</p>";
      return;
    }

    favorisEquips.forEach((equip, index) => {
      setTimeout(() => {
        const card = document.createElement("div");
        card.classList.add("character-card", "fade-in");
        card.innerHTML = `
          <img src="${equip.image}" alt="${equip.name}">
          <div class="character-info">
            <h2>${equip.name}</h2>
            <div class="character-meta">
              <span class="character-class">${equip.type}</span>
              <span class="character-stat">
                ${equip.damage ? `🗡 ${equip.damage}` : equip.defense ? `🛡 ${equip.defense}` : ""}
              </span>
            </div>
          </div>
        `;
        card.querySelector("img").addEventListener("click", () => {
          window.location.hash = `#/equipement/${equip.id}`;
        });
        container.appendChild(card);
      }, index * 50);
    });
  });
}
