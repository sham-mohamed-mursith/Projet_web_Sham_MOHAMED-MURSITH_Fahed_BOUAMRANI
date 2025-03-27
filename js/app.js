import Provider from './provider.js';
import { renderFavoris } from './views/favoris.js';
import { renderDetail } from './views/detail.js';

const provider = new Provider('http://localhost:3000');
const app = document.getElementById("app");
const searchInput = document.getElementById("search-bar");

let allPersonnages = [];
let allEquipements = [];
let favoris = [];

function renderHome() {
  app.innerHTML = `<div class="characters-grid" id="characters-container"><div class="loader"></div></div>`;

  provider.getPersonnages().then(personnages => {
    provider.getEquipements().then(equipements => {
      allPersonnages = personnages;
      allEquipements = equipements;
      favoris = JSON.parse(localStorage.getItem("favoris")) || [];
      renderCards(allPersonnages);
    });
  });
}

function renderCards(data) {
  const container = document.getElementById("characters-container");
  container.innerHTML = "";

  data.forEach((perso, index) => {
    setTimeout(() => {
      const isFavori = favoris.includes(perso.id);
      const starClass = isFavori ? 'fa-solid' : 'fa-regular';

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
            <i class="${starClass} fa-star"></i> Favori
          </button>
        </div>
      `;

      card.querySelector("img").addEventListener("click", () => {
        window.location.hash = `#/detail/${perso.id}`;
      });

      card.querySelector(".favori-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        const id = perso.id;
        const index = favoris.indexOf(id);
        if (index === -1) {
          favoris.push(id);
        } else {
          favoris.splice(index, 1);
        }
        localStorage.setItem("favoris", JSON.stringify(favoris));
        const starIcon = card.querySelector("i");
        starIcon.className = `${favoris.includes(id) ? 'fa-solid' : 'fa-regular'} fa-star`;
      });

      container.appendChild(card);
    }, index * 50);
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const filtered = allPersonnages.filter(p =>
      p.name.toLowerCase().includes(value)
    );
    renderCards(filtered);
  });
}

function router() {
  const hash = window.location.hash;
  if (!hash || hash === "#/" || hash === "") {
    renderHome();
  } else if (hash === "#/favoris") {
    renderFavoris(provider);
  } else if (hash.startsWith("#/detail/")) {
    const id = hash.split("/")[2];
    renderDetail(provider, id);
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

document.getElementById("voir-favoris").addEventListener("click", () => {
  window.location.hash = "#/favoris";
});
document.getElementById("retour-accueil").addEventListener("click", () => {
  window.location.hash = "#/";
});
