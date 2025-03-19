import API_BASE_URL from "./config.js";
import HomePage from "./views/HomePage.js";

const loadPage = async () => {
    const content = document.querySelector("#content");
    content.innerHTML = await HomePage.render();
};

window.addEventListener("load", loadPage);
