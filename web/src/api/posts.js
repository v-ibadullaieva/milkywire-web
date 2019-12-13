export const fetchPosts = async () => {
  const res = await fetch('http://localhost:3001/posts');
  return await res.json();
}

export const deletePost = (id) => {
  return fetch(`http://localhost:3001/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const editPost = (data) => {
  return fetch(`http://localhost:3001/posts/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const uploadImg = async (data) => {
  const formData  = new FormData();
  formData.append('image', data);

  const res = await fetch(`http://localhost:3001/upload`, {
    method: 'POST',
    body: formData
  });

  return await res.json();
}
