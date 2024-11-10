const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJvYmluc29uLm11bm96QHV0cC5lZHUuY28iLCJpYXQiOjE3MzA4NTkzODAsImV4cCI6MTczMzQ1MTM4MH0.t6ohvYvdZU3Y-KBIKrjeaC-AAWNJ3TPJcBGx0LV2Rfk";
const apiURL = 'http://localhost:3000';

let peliculaGlobal = []
async function getPosts() {
  try {
    const response = await fetch(apiURL + "/post", {
      method: 'GET',  // Método GET para obtener datos
      headers: {
        'Authorization': `Bearer ${token}`,  // Token de autorización, si es necesario
        'Content-Type': 'application/json'   // Tipo de contenido JSON
      }
    });

    // Comprobar si la respuesta es exitosa
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    // Obtener la respuesta en formato JSON
    peliculaGlobal = await response.json();
    await displayPosts(peliculaGlobal)

  } catch (err) {
    console.error('Error al obtener los posts:', err);
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


    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.description ? post.description : 'No hay descripción disponible'}</p>
      <img src="${post.imageUrl}" alt="Imagen de ${post.title}" style="width: 100px; height: 150px;">
      <p><strong>Calificación:</strong> ${post.value}</p>
      <button onclick="editPost('${post.id}')">Editar</button>
      <button onclick="deletePost('${post.id}')">Eliminar</button>
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
async function createPost() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("content").value;
  const imageUrl = document.getElementById("imageUrl").value;
  const value = document.getElementById("value").value;

  // Verifica si los valores están siendo capturados correctamente
  //const images = imageUrl ? [imageUrl] : [];

  try {
    const response = await fetch(apiURL + '/crearPelicula', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, imageUrl, value }),
    });

    if (!response.ok) throw new Error('Error al crear el post');

    const data = await response.json();
    console.log(data)
    if(data == 'ok'){
      console.log("cargando pagina ")
      location.reload()
    }
  } catch (error) {
    console.error('Error al crear el post:', error);
    alert('Hubo un error al crear el post.');
  }
}

// Eliminar post
async function deletePost(postId) {
  if (!confirm('¿Estás seguro de que deseas eliminar este post?')) return;

  try {
    const response = await fetch(apiURL + "/eliminarPelicula", {  // Asegúrate de que se está utilizando el id del post
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
    });

    if (!response.ok) throw new Error('Error al eliminar el post');
    
    let data = await response.json()
    console.log(data)
    if(data == "ok"){
      location.reload()
    }

  } catch (error) {
    console.error('Error al eliminar el post:', error);
    alert('Hubo un error al eliminar el post.');
  }
}

// Editar post
function editPost(postId) {
  // Encuentra el post con el ID correspondiente (puedes usar un array de objetos o tu estructura de datos original).
  const post = peliculaGlobal.find(p => p.id === postId);

  // Llena el formulario con los datos actuales de la película
  document.getElementById('editTitle').value = post.title;
  document.getElementById('editDescription').value = post.description || '';
  document.getElementById('editValue').value = post.value;
  document.getElementById('editUrl').value = post.imageUrl;

  // Guarda el ID del post que se está editando (puedes usar una variable global o un campo oculto en el formulario)
  document.getElementById('editForm').setAttribute('data-post-id', postId);

  // Muestra el formulario
  document.getElementById('editForm').style.display = 'block';
}

async function saveEdit() {
  // Obtén el ID del post que se está editando
  const postId = document.getElementById('editForm').getAttribute('data-post-id');
  console.log(postId)

  // Actualiza los valores del post con los valores del formulario
  title = document.getElementById('editTitle').value;
  description = document.getElementById('editDescription').value;
  value = document.getElementById('editValue').value;
  imageUrl = document.getElementById('editUrl').value;

  console.log(title, description, value, imageUrl)

  try{
    const response = await fetch(apiURL + "/actualizarPelicula", {  // Asegúrate de que se está utilizando el id del post
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId,title, description, imageUrl, value }),
    });

    if (!response.ok) throw new Error('Error al eliminar el post');

    const data = await response.json(); 
    if(data == 'ok'){
      location.reload()
    }

  }catch(err){
    console.log(err)
    alert(err)
  }

  // Cierra el formulario y vuelve a mostrar la lista actualizada
  closeEditForm();
  //displayPosts(posts);  // Vuelve a renderizar los posts con los cambios
}

function closeEditForm() {
  // Oculta el formulario de edición
  document.getElementById('editForm').style.display = 'none';
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
