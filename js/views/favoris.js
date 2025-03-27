export function renderFavoris(provider) {
  const app = document.getElementById("app");
  app.innerHTML = `<div class="characters-grid" id="characters-container"><div class="loader"></div></div>`;

  const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
  if (favoris.length === 0) {
    app.innerHTML = `<p class="empty-favoris">Aucun favori enregistré.</p>`;
    return;
  }

  provider.getPersonnages().then(personnages => {
    const persos = personnages.filter(p => favoris.includes(p.id));
    const container = document.getElementById("characters-container");
    container.innerHTML = "";

    persos.forEach((perso, index) => {
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
            <button class="favori-btn" data-id="${perso.id}">
              <i class="fa-solid fa-star"></i> Favori
            </button>
          </div>
        `;

        card.querySelector("img").addEventListener("click", () => {
          window.location.hash = `#/detail/${perso.id}`;
        });

        card.querySelector(".favori-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          const id = perso.id;
          const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
          const index = favoris.indexOf(id);
          if (index !== -1) {
            favoris.splice(index, 1);
            localStorage.setItem("favoris", JSON.stringify(favoris));
            renderFavoris(provider);
          }
        });

        container.appendChild(card);
      }, index * 50);
    });
  });
}
