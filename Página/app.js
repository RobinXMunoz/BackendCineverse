const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJvYmluc29uLm11bm96QHV0cC5lZHUuY28iLCJpYXQiOjE3MzA4NTkzODAsImV4cCI6MTczMzQ1MTM4MH0.t6ohvYvdZU3Y-KBIKrjeaC-AAWNJ3TPJcBGx0LV2Rfk";
const apiURL = 'http://localhost:3001/posts/';


// Obtener y mostrar posts
async function getPosts() {
  try {
    const response = await fetch(apiURL, {  // Cambio aquí: eliminamos 'post-firebase'
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const posts = await response.json();
    if (Array.isArray(posts)) {
      displayPosts(posts);
    } else {
      console.error('La respuesta no es un array:', posts);
    }
  } catch (error) {
    console.error('Error al obtener los posts:', error);
    alert('Hubo un error al obtener los posts.');
  }
}

// Mostrar los posts
function displayPosts(posts) {
  const postsSection = document.getElementById('posts');
  postsSection.innerHTML = '';

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.id = `post-${post.id}`;

    let images = [];
    if (typeof post.images === 'string') {
      try {
        images = JSON.parse(post.images);
      } catch (error) {
        console.error('Error al parsear images:', error);
      }
    } else if (Array.isArray(post.images)) {
      images = post.images;
    }

    const imagesHTML = images.map(image => `<img src="${image}" alt="Imagen del post" style="max-width: 100%; height: auto;">`).join('');

    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.description ? post.description : 'No hay descripción disponible'}</p>
      ${imagesHTML}
      <p><strong>Calificación:</strong> ${post.value}</p>
      <button onclick="editPost(${post.id})">Editar</button>
      <button onclick="deletePost(${post.id})">Eliminar</button>
    `;

    postsSection.appendChild(postElement);
  });
}

// Crear o actualizar post
async function createOrUpdatePost(event) {
  event.preventDefault();

  const postId = document.getElementById('postId').value;
  const title = document.getElementById('title').value;
  const description = document.getElementById('content').value;
  const imageUrl = document.getElementById('imageUrl').value;
  const valueField = document.getElementById('value');
  const value = valueField && valueField.value.trim() !== '' ? Number(valueField.value) : 0;

  if (isNaN(value)) {
    alert('El campo "value" debe ser un número válido.');
    return;
  }

  postId ? await updatePost(postId, title, description, imageUrl, value) : await createPost(title, description, imageUrl, value);
}

// Crear nuevo post
async function createPost(title, description, imageUrl, value) {
  const images = imageUrl ? [imageUrl] : [];

  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, value, images }),
    });

    if (!response.ok) throw new Error('Error al crear el post');

    getPosts();
  } catch (error) {
    console.error('Error al crear el post:', error);
    alert('Hubo un error al crear el post.');
  }
}

// Eliminar post
async function deletePost(postId) {
  if (!confirm('¿Estás seguro de que deseas eliminar este post?')) return;

  try {
    const response = await fetch(`${apiURL}${postId}`, {  // Asegúrate de que se está utilizando el id del post
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Error al eliminar el post');
    
    document.getElementById(`post-${postId}`).remove();
  } catch (error) {
    console.error('Error al eliminar el post:', error);
    alert('Hubo un error al eliminar el post.');
  }
}

// Editar post
function editPost(postId) {
  const postElement = document.getElementById(`post-${postId}`);
  document.getElementById('title').value = postElement.querySelector('h3').textContent;
  document.getElementById('content').value = postElement.querySelector('p').textContent;
  document.getElementById('postId').value = postId;
}

// Actualizar post
async function updatePost(postId, title, description, imageUrl, value) {
  const images = imageUrl ? [imageUrl] : [];

  try {
    const response = await fetch(`${apiURL}${postId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, value, images }),
    });

    if (!response.ok) throw new Error('Error al actualizar el post');
    
    getPosts();
    document.getElementById('postForm').reset();
  } catch (error) {
    console.error('Error al actualizar el post:', error);
    alert('Hubo un error al actualizar el post.');
  }
}

document.getElementById('postForm').addEventListener('submit', createOrUpdatePost);
getPosts();
