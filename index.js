document.getElementById("btn-header").addEventListener("click", () => {
  document.querySelector("#section2").scrollIntoView({
    behavior: "smooth"
  });
});

// // Menu Burger 

// const burger = document.getElementById('burger');
//     const mobileMenu = document.getElementById('mobile-menu');
//     const lines = burger.querySelectorAll('span');

//     burger.addEventListener('click', () => {
//       // Animation du burger
//       lines[0].classList.toggle('rotate-45');
//       lines[0].classList.toggle('translate-y-2');

//       lines[1].classList.toggle('opacity-0');

//       lines[2].classList.toggle('-rotate-45');
//       lines[2].classList.toggle('-translate-y-2');

//       // Affichage du menu mobile
//       mobileMenu.classList.toggle('hidden');
//       mobileMenu.classList.toggle('flex');
//     });