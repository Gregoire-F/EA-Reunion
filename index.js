const burger = document.getElementById("burger");
const nav = document.getElementById("menu");

burger.addEventListener("click", () => {
  burger.classList.toggle("active"); // animation des barres
  nav.classList.toggle("open"); // slide du menu mobile
  const expanded = burger.getAttribute("aria-expanded") === "true";
  burger.setAttribute("aria-expanded", !expanded);
});

document.getElementById("btn-header").addEventListener("click", () => {
  document.querySelector("#section2").scrollIntoView({
    behavior: "smooth"
  });
});
