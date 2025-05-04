const BASE_URL = 'http://localhost:8080/api/posts';
const COMMENTS_BASE_URL = 'http://localhost:8080/api/comments';

export async function getPosts() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener posts');
  return await res.json();
}

export async function createPost(post) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });
  if (!res.ok) throw new Error('Error al crear post');
  return await res.json();
}

export const createComment = async ({ text, postId, parentCommentId, userId, name, avatar }) => {
  const res = await fetch(COMMENTS_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, postId, parentCommentId, userId, name, avatar }),
  });
  if (!res.ok) throw new Error('Error al crear comentario');
  return await res.json();
};

export async function getReplies(postId) {
  const res = await fetch(COMMENTS_BASE_URL + `?postId=${postId}`);
  console.log("Status code:", res.status);
  if (!res.ok) throw new Error('Error al obtener comentarios');
  return await res.json();
}