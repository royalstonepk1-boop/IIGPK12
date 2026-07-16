import api from "./api";

/**
 * Admin-only certificate CRUD calls. Every request needs a Firebase ID
 * token, passed in as `token` (get it from `useAuth().getToken()`).
 */
function authHeader(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function listCertificatesAdmin(token) {
  const { data } = await api.get("/api/certificates", authHeader(token));
  return data;
}

export async function getCertificateAdmin(token, id) {
  const { data } = await api.get(`/api/certificates/${id}`, authHeader(token));
  return data;
}

export async function createCertificateAdmin(token, payload) {
  const { data } = await api.post("/api/certificates", payload, authHeader(token));
  return data;
}

export async function updateCertificateAdmin(token, id, payload) {
  const { data } = await api.put(`/api/certificates/${id}`, payload, authHeader(token));
  return data;
}

export async function deleteCertificateAdmin(token, id) {
  const { data } = await api.delete(`/api/certificates/${id}`, authHeader(token));
  return data;
}

export async function uploadImageAdmin(token, file) {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.post("/api/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data; // { url, publicId }
}