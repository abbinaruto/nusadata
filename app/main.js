// NusaData router — hash routes, no network, no framework.
// Routes: #/ home, #/population, #/economy, #/regions, #/people, #/methods.

import {
  renderHome, mountHome,
  renderPopulation, mountPopulation,
  renderEconomy, mountEconomy,
  renderRegions, mountRegions,
  renderPeople, mountPeople,
  renderMethods, mountMethods,
} from "./views.js";

const ROUTES = {
  "/": { title: "NusaData — Indonesia in numbers", render: renderHome, mount: mountHome },
  "/population": { title: "Population — NusaData", render: renderPopulation, mount: mountPopulation },
  "/economy": { title: "Economy — NusaData", render: renderEconomy, mount: mountEconomy },
  "/regions": { title: "Regions — NusaData", render: renderRegions, mount: mountRegions },
  "/people": { title: "People — NusaData", render: renderPeople, mount: mountPeople },
  "/methods": { title: "Methods & sources — NusaData", render: renderMethods, mount: mountMethods },
};

function currentRoute() {
  const hash = window.location.hash || "#/";
  const path = hash.slice(1) || "/";
  return ROUTES[path] ? path : "/";
}

function render() {
  const path = currentRoute();
  const route = ROUTES[path];
  const view = document.getElementById("view");
  view.innerHTML = route.render();
  document.title = route.title;
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const linkPath = link.getAttribute("href").slice(1) || "/";
    link.classList.toggle("active", linkPath === path);
    if (linkPath === path) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  route.mount();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
