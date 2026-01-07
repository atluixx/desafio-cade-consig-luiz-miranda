"use client";

import type { JSX, FormEvent } from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Register(): JSX.Element {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/register", { usuario, senha }, { withCredentials: true });

      toast.success("Conta criada com sucesso! 🎉");

      window.location.href = "/dashboard";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Não foi possível criar sua conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 border rounded-xl p-6 shadow">
        <h1 className="text-xl font-semibold">Registrar</h1>

        <div className="space-y-1">
          <label className="text-sm font-medium">Usuário</label>
          <Input required placeholder="seuusuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Senha</label>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </main>
  );
}
