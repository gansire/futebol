import React, { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.scss'; // mesmo estilo do Login

export function Register() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token);
      } else {
        setError(data.message || 'Erro ao registrar');
      }
    } catch {
      setError('Erro na comunicação com o servidor');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Cadastro</h2>
        <input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          type="text"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          type="email"
        />
        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}