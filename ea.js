
async function loadAllPosts() {
  const main = document.querySelector('main'); 

  try {
    const slug = 'les-entreprises-adaptees-de-la-reunion';
    const response = await fetch(`http://ealareunion.local/wp-json/wp/v2/pages?slug=${slug}`);
    const posts = await response.json();
    console.log(posts); // pour voir tous les posts dans la console

  if (posts.length > 0) {
    const post = posts[0];
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

        const titleEl = document.createElement('h2');
        titleEl.textContent = post.title.rendered;
        titleEl.className = 'text-2xl font-bold text-green-700 mb-4 mt-4';

        const contentEl = document.createElement('div');
        contentEl.className = 'text-2xl mt-10';
        const fragment = document.createRange().createContextualFragment(post.content.rendered);
        contentEl.appendChild(fragment); 

        postDiv.appendChild(titleEl);
        postDiv.appendChild(contentEl);
        main.appendChild(postDiv);
      };

  } catch (error) {
    console.error('Erreur:', error);
    main.innerText = "Impossible de charger les posts.";
  }
}

// Appel de la fonction
loadAllPosts();