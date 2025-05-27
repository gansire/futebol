import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.scss"
export function CreateGroup() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nome do grupo é obrigatório");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // ou de onde você pega o token
      await api.post(
        "/groups",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // sucesso, redireciona para lista de grupos
      navigate("/grupos");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar grupo");
    }
  }

  return (
    <div className="create-group-container">
      <h2>Criar Novo Grupo</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do grupo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Criar</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}