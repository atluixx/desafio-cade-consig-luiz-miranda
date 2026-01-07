"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

import Filters from "../../components/Filters";
import ContractsTable from "../../components/ContractsTable";
import Pagination from "../../components/Pagination";

import type { PageResponse } from "./types";

export default function Dashboard() {
  const [data, setData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);

  const limit = 20;

  const [idContrato, setIdContrato] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [plano, setPlano] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [valorFiltro, setValorFiltro] = useState("");
  const [dataTexto, setDataTexto] = useState("");
  const [dataInicio, setDataInicio] = useState<Date>();

  const carregar = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/contratos", {
        params: {
          page,
          limit,
          id_contrato: idContrato.trim() || undefined,
          nome_cliente: nome || undefined,
          email_cliente: email || undefined,
          tipo_plano: plano || undefined,
          status: status || undefined,
          valor_mensal: valorFiltro || undefined,
          data_inicio: dataTexto || undefined,
        },
        withCredentials: true,
      });

      setData({
        ...data.contratos,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: data.contratos.items.map((c: any) => ({
          id: c.id_contrato,
          nome: c.nome_cliente,
          email: c.email_cliente,
          plano: c.tipo_plano,
          valor: Number(c.valor_mensal),
          status: c.status === "ATIVO" ? "Ativo" : "Inativo",
          data_inicio: c.data_inicio,
        })),
      });
    } catch {
      toast.error("Erro ao carregar contratos");
    } finally {
      setLoading(false);
    }
  }, [page, idContrato, nome, email, plano, status, valorFiltro, dataTexto]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      if (!file.name.endsWith(".csv")) return toast.error("Envie um arquivo CSV válido");

      const form = new FormData();
      form.append("file", file);

      const t = toast.loading("Importando...");
      setUploading(true);

      try {
        await axios.post("/api/contratos", form, { withCredentials: true });
        toast.success("Contratos importados!");
        carregar();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        toast.error(e?.response?.data?.message ?? "Erro ao importar arquivo");
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

      <Filters
        idContrato={idContrato}
        setIdContrato={setIdContrato}
        nome={nome}
        setNome={setNome}
        email={email}
        setEmail={setEmail}
        plano={plano}
        setPlano={setPlano}
        status={status}
        setStatus={setStatus}
        valorFiltro={valorFiltro}
        setValorFiltro={setValorFiltro}
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataTexto={dataTexto}
        setDataTexto={setDataTexto}
        loading={loading}
        aplicar={() => {
          setPage(1);
          carregar();
        }}
        limpar={() => {
          setIdContrato("");
          setNome("");
          setEmail("");
          setPlano(undefined);
          setStatus(undefined);
          setValorFiltro("");
          setDataInicio(undefined);
          setDataTexto("");
          setPage(1);
        }}
      />

      <section className="border rounded-lg p-4">
        <div className="flex justify-between mb-4">
          <h2 className="font-medium">Contratos</h2>
          <Button variant="outline" onClick={carregar} disabled={loading}>
            {loading ? "Atualizando..." : "Recarregar"}
          </Button>
        </div>

        {!data ? (
          <p>Carregando...</p>
        ) : !data.items.length ? (
          <p>Nenhum contrato encontrado.</p>
        ) : (
          <ContractsTable contratos={data.items} />
        )}

        {data && <Pagination page={data.page} totalPages={data.totalPages} setPage={setPage} />}
      </section>
    </main>
  );
}
