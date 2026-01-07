"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type Contrato = {
  nome: string;
  email: string;
  plano: string;
  valor: number;
  status: string;
  data_inicio: string;
};

type PageResponse = {
  items: Contrato[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

export default function Dashboard() {
  const [data, setData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);

  const limit = 20;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [plano, setPlano] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();

  const carregar = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/contratos", {
        params: {
          page,
          limit,
          nome_cliente: nome || undefined,
          email_cliente: email || undefined,
          tipo_plano: plano || undefined,
          status: status || undefined,
        },
        withCredentials: true,
      });

      const contratos = res.data.contratos;

      const pageData: PageResponse = {
        ...contratos,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: contratos.items.map((c: any) => ({
          nome: c.nome_cliente,
          email: c.email_cliente,
          plano: c.tipo_plano,
          valor: Number(c.valor_mensal),
          status: c.status === "ATIVO" ? "Ativo" : "Inativo",
          data_inicio: c.data_inicio,
        })),
      };

      setData(pageData);
    } catch {
      toast.error("Erro ao carregar contratos");
    } finally {
      setLoading(false);
    }
  }, [page, nome, email, plano, status]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;

      if (!file.name.endsWith(".csv")) {
        toast.error("Envie um arquivo CSV válido");
        return;
      }

      const form = new FormData();
      form.append("file", file);

      const t = toast.loading("Importando...");
      setUploading(true);

      try {
        await axios.post("/api/contratos", form, { withCredentials: true });
        toast.success("Contratos importados!");
        carregar();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "Erro ao importar arquivo");
      } finally {
        toast.dismiss(t);
        setUploading(false);
      }
    },
    [carregar],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: false,
    noClick: true,
    onDrop,
  });

  const contratos = data?.items ?? [];

  const StatusBadge = ({ status }: { status: string }) => (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        status === "Ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );

  const formatMoney = (v?: number) =>
    v == null ? "-" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <main className="min-h-[70vh] w-full p-8 space-y-8 overflow-y-scroll">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button onClick={open} disabled={uploading}>
            {uploading ? "Enviando..." : "Importar CSV"}
          </Button>
        </div>
      </header>

      <div className={`border rounded-lg p-4 text-sm ${isDragActive ? "bg-muted" : ""}`}>
        Arraste um CSV aqui ou clique em “Importar CSV”.
      </div>

      <section className="border rounded-lg p-4 space-y-4">
        <h2 className="font-medium">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Nome do cliente" value={nome} onChange={(e) => setNome(e.target.value)} />

          <Input placeholder="Email do cliente" value={email} onChange={(e) => setEmail(e.target.value)} />

          <Select onValueChange={setPlano} value={plano}>
            <SelectTrigger>
              <SelectValue placeholder="Plano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Basico">Básico</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ATIVO">Ativo</SelectItem>
              <SelectItem value="INATIVO">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              setPage(1);
              carregar();
            }}
            disabled={loading}
          >
            Aplicar filtros
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setNome("");
              setEmail("");
              setPlano(undefined);
              setStatus(undefined);
              setPage(1);
            }}
          >
            Limpar filtros
          </Button>
        </div>
      </section>

      <section className="border rounded-lg p-4">
        <div className="flex justify-between mb-4">
          <h2 className="font-medium">Contratos</h2>

          <Button variant="outline" onClick={carregar} disabled={loading}>
            {loading ? "Atualizando..." : "Recarregar"}
          </Button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : !contratos.length ? (
          <p>Nenhum contrato encontrado.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/60 text-xs uppercase text-muted-foreground">
                <th className="text-left py-2 px-3">Nome</th>
                <th className="text-left py-2 px-3">E-mail</th>
                <th className="text-left py-2 px-3">Plano</th>
                <th className="text-left py-2 px-3">Valor</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Data início</th>
              </tr>
            </thead>

            <tbody>
              {contratos.map((c, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 px-3">{c.nome}</td>
                  <td className="py-2 px-3">{c.email}</td>
                  <td className="py-2 px-3">{c.plano}</td>
                  <td className="py-2 px-3">{formatMoney(c.valor)}</td>
                  <td className="py-2 px-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-2 px-3">{new Date(c.data_inicio).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {data && (
          <div className="flex justify-between mt-4 text-sm">
            <span>
              Página {data.page} de {data.totalPages}
            </span>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={data.page <= 1} onClick={() => setPage((p) => p - 1)}>
                Anterior
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={data.page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
