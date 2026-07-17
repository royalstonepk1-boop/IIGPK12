import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  listCertificatesAdmin,
  createCertificateAdmin,
  updateCertificateAdmin,
  deleteCertificateAdmin,
  uploadImageAdmin,
} from "../services/adminApi";

const EMPTY_FORM = { number: "", imgUrl: "" };
const NUMBER_MAX_LENGTH = 10;

export default function AdminDashboard() {
  const { user, logout, getToken } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);   // picked file, not uploaded yet
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const data = await listCertificatesAdmin(token);
      setCerts(data);
    } catch (err) {
      setError(
        err?.response?.status === 403
          ? "Your account doesn't have admin access."
          : err?.response?.data?.message || "Couldn't load certificates."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setPreview("");
  }

  function startEdit(cert) {
    setEditingId(cert._id);
    setForm({ number: cert.number, imgUrl: cert.imgUrl });
    setImageFile(null);
    setPreview(cert.imgUrl); // show existing image until replaced
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Remove the previous preview before setting the new one.
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file)); // local preview, no upload yet
  }

  function clearImage() {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setImageFile(null);
    setPreview("");
    setForm((f) => ({ ...f, imgUrl: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const token = await getToken();
      let imgUrl = form.imgUrl;

      // Only hits Cloudinary if a new file was picked for this submit.
      if (imageFile) {
        const uploaded = await uploadImageAdmin(token, imageFile);
        imgUrl = uploaded.url;
      }

      if (!imgUrl) {
        setError("Please choose an image.");
        setSaving(false);
        return;
      }

      const payload = { number: form.number, imgUrl };
      if (editingId) {
        await updateCertificateAdmin(token, editingId, payload);
      } else {
        await createCertificateAdmin(token, payload);
      }

      startCreate();
      await refresh();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save the certificate.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this certificate? This can't be undone.")) return;
    try {
      const token = await getToken();
      await deleteCertificateAdmin(token, id);
      await refresh();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't delete the certificate.");
    }
  }

  const filteredCerts = certs.filter((c) =>
    c.number.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-emerald-950">Certificates</h1>
          <p className="text-sm text-stone-600 mt-1">Signed in as {user?.adminId}</p>
        </div>
        <button
          onClick={logout}
          className="text-xs uppercase tracking-widest font-semibold text-emerald-900 border border-emerald-900/30 rounded-lg px-4 py-2 hover:bg-emerald-900 hover:text-ivory transition-colors"
        >
          Sign out
        </button>
      </div>

      {error && (
        <p className="mb-6 text-sm text-red-700 bg-red-100 rounded-md px-4 py-2">{error}</p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_560px]">


        {/* Create / edit form */}
        <div className="bg-ivory rounded-2xl shadow-card ring-1 ring-stone-900/5 p-6">
          <h2 className="font-display text-xl text-emerald-950 mb-4">
            {editingId ? "Edit certificate" : "Add certificate"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-600 mb-1.5">
                Number
              </label>
              <input
                required
                type="text"
                maxLength={NUMBER_MAX_LENGTH}
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                className="w-full rounded-lg border border-stone-900/10 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold-500/60"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-600 mb-1.5">
                Certificate image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-900 file:text-ivory file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-widest hover:file:bg-emerald-800 file:cursor-pointer"
              />
              {preview && (
                <div className="relative mt-3 h-24 w-24">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-lg ring-1 ring-stone-900/10"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    aria-label="Remove selected image"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-stone-900 text-ivory text-xs font-bold flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving || (!imageFile && !form.imgUrl)}
              className="flex-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 text-ivory font-semibold text-sm tracking-wide px-4 py-2.5 transition-colors"
            >
              {saving ? "Uploading & saving…" : editingId ? "Save changes" : "Add certificate"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={startCreate}
                className="rounded-lg border border-stone-900/15 text-stone-700 text-sm font-semibold px-4 py-2.5 hover:bg-stone-900/5"
              >
                Cancel
              </button>
            )}
            {/* </div> */}
          </form>
        </div>
        {/* Table */}
        <div className="bg-ivory rounded-2xl shadow-card ring-1 ring-stone-900/5 overflow-hidden">
        <div className="text-center">Total Certificates : <span className="text-red-500 font-bold">{filteredCerts?.length}</span></div>
          <div className="p-4 border-b border-stone-900/5">
            <div className="relative">
              <input
                type="text"
                maxLength={NUMBER_MAX_LENGTH}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by number…"
                className="w-full rounded-lg border border-stone-900/10 pl-4 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold-500/60"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-stone-900/10 text-stone-700 text-xs font-bold flex items-center justify-center hover:bg-stone-900/20 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="overflow-auto max-h-[420px]">
            <table className="w-full text-sm">
              <thead className="bg-emerald-950 text-ivory sticky top-0">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Number</th>
                  <th className="text-left px-5 py-3 font-semibold">Image</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-stone-500">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading && filteredCerts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-stone-500">
                      {certs.length === 0
                        ? "No certificates yet — add one on the left."
                        : "No certificates match your search."}
                    </td>
                  </tr>
                )}
                {filteredCerts.map((c) => (
                  <tr key={c._id} className="border-t border-stone-900/5">
                    <td className="px-5 py-3 font-semibold text-emerald-900">{c.number}</td>
                    <td className="px-5 py-3">
                      <img src={c.imgUrl} alt={c.number} className="h-12 w-12 object-cover rounded-md" />
                    </td>
                    <td className="px-5 py-3 text-right space-x-3">
                      <button
                        onClick={() => startEdit(c)}
                        className="text-xs font-semibold uppercase tracking-widest text-emerald-800 hover:text-emerald-950"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-xs font-semibold uppercase tracking-widest text-red-700 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div >
    </div >
  );
}