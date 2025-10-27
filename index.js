// const main = document.querySelector('main')

// let content = ""

// const data = fetch("http://ealareunion.local/wp-json/wp/v2/posts")
// .then(response => response.json())
//   .then(posts => {
//     console.log(posts)
//     content = posts[0].content.rendered;
//     const p = document.createElement('div');
//     p.innerHTML = content;
//     main.appendChild(p)
//     console.log(content);
    
//   })
//   .catch(error => console.error('Erreur:', error));

// async function loadAllPosts() {
//   const main = document.querySelector('main'); // cible le <main>

//   try {
//     // Récupération des posts depuis l'API WordPress
//     const response = await fetch("http://ealareunion.local/wp-json/wp/v2/posts");
//     const posts = await response.json();
//     console.log(posts); // pour voir tous les posts dans la console

//     if (posts.length === 0) {
//       main.innerText = "Aucun post trouvé.";
//       return;
//     }

//     // Parcours de tous les posts
//     posts.forEach(post => {
//       const postDiv = document.createElement('div');
//       postDiv.classList.add('post');

//       const titleEl = document.createElement('h2');
//       titleEl.innerHTML = post.title.rendered;
//       titleEl.className = 'text-4xl font-bold text-green-700 mb-4 mt-4 flex justify-center';

//       const contentEl = document.createElement('div');
//       contentEl.className = 'text-2xl mt-10';
//       const fragment = document.createRange().createContextualFragment(post.content.rendered);
//       contentEl.appendChild(fragment); 

//       postDiv.appendChild(titleEl);
//       postDiv.appendChild(contentEl);
//       main.appendChild(postDiv);
//     });

//   } catch (error) {
//     console.error('Erreur:', error);
//     main.innerText = "Impossible de charger les posts.";
//   }
// }

// // Appel de la fonction
// loadAllPosts();


