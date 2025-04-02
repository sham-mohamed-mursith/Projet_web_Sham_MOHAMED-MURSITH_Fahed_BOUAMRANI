export function renderEquipements(provider) {
    const app = document.getElementById("app");
    app.innerHTML = `<div class="characters-grid" id="equipements-container"><div class="loader"></div></div>`;
  
    provider.getEquipements().then(equipements => {
      const container = document.getElementById("equipements-container");
      container.innerHTML = "";
  
      const favorisEquipements = JSON.parse(localStorage.getItem("favorisEquipements")) || [];
  
      equipements.forEach((equip, index) => {
        setTimeout(() => {
          const isFavori = favorisEquipements.includes(equip.id);
          const starClass = isFavori ? 'fa-solid' : 'fa-regular';
  
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
              <button class="favori-btn" data-id="${equip.id}">
                <i class="${starClass} fa-star"></i> Favori
              </button>
            </div>
          `;
  
          card.querySelector("img").addEventListener("click", () => {
            window.location.hash = `#/equipement/${equip.id}`;
          });
  
          card.querySelector(".favori-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            const id = equip.id;
            const index = favorisEquipements.indexOf(id);
            if (index === -1) {
              favorisEquipements.push(id);
            } else {
              favorisEquipements.splice(index, 1);
            }
            localStorage.setItem("favorisEquipements", JSON.stringify(favorisEquipements));
            const icon = card.querySelector("i");
            icon.className = `${favorisEquipements.includes(id) ? 'fa-solid' : 'fa-regular'} fa-star`;
          });
  
          container.appendChild(card);
        }, index * 50);
      });
    });
  }
  