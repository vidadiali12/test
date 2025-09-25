import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Page = ({ userId, setAccess }) => {
  const initialForm = {
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    father: "",
    aseKey: "",
    isActive: true,
    isAdmin: false,
  };

  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password təkrarı yoxlaması
    if (formData.password !== formData.confirmPassword) {
      alert("⚠️ Şifrələr üst-üstə düşmür!");
      return;
    }

    let users = JSON.parse(localStorage.getItem("totalUsers1")) || [];

    const newId = users.length + 1;

    const newUser = {
      userId: newId,
      certId: newId,
      username: formData.username,
      password: formData.password,
      name: formData.name,
      surname: formData.surname,
      father: formData.father,
      aseKey: formData.aseKey,
      isActive: formData.isActive,
      isAdmin: formData.isAdmin,
    };

    users.push(newUser);

    localStorage.setItem("totalUsers1", JSON.stringify(users));

    alert("✅ İstifadəçi uğurla əlavə olundu!");

    setFormData(initialForm);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-olive-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-olive-700 mb-6">
          Qeydiyyat
        </h1>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Ad"
            value={formData.name}
            onChange={handleChange}
            className="border border-customGray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-olive-400"
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Soyad"
            value={formData.surname}
            onChange={handleChange}
            className="border border-customGray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-olive-400"
            required
          />
          <input
            type="text"
            name="father"
            placeholder="Ata adı"
            value={formData.father}
            onChange={handleChange}
            className="border border-customGray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-olive-400"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="İstifadəçi adı"
            value={formData.username}
            onChange={handleChange}
            className="border border-customGray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-olive-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Şifrə"
            value={formData.password}
            onChange={handleChange}
            className="border border-customGray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-olive-400"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Şifrə təkrarı"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border border-customGray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-olive-400"
            required
          />
          <input
            type="text"
            name="aseKey"
            placeholder="ASE açarı"
            value={formData.aseKey}
            onChange={handleChange}
            className="border border-customGray-200 rounded-lg p-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-olive-400"
            required
          />

          <div className="flex items-center gap-4 col-span-2">
            <label className="flex items-center gap-1 text-customGray-100">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>Aktiv</span>
            </label>
            <label className="flex items-center gap-1 text-customGray-100">
              <input
                type="checkbox"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
              />
              <span>Admin</span>
            </label>
          </div>

          <button
            type="submit"
            className="col-span-2 bg-olive-500 text-white font-semibold py-2 rounded-lg hover:bg-olive-600 transition"
          >
            Qeydiyyatdan keç
          </button>
        </form>

        <button
          onClick={() => navigate('/test')}
          className="mt-4 w-full bg-customGray-100 text-white font-semibold py-2 rounded-lg hover:bg-customGray-50 transition"
        >
          Geri qayıt
        </button>
      </div>
    </div>
  );
};

export default Page;
