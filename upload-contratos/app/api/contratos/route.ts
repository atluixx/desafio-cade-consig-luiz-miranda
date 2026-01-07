import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { api } from "..";

const contratoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.email("E-mail inválido"),
  plano: z.string().min(1, "Plano é obrigatório"),
  valor: z.string().min(1, "Valor é obrigatório"),
  status: z.string().min(1, "Status é obrigatório"),
  data_inicio: z.string().min(1, "Data é obrigatória"),
});

type Contrato = z.infer<typeof contratoSchema>;

export const GET = async (req: NextRequest) => {
  const token = req.cookies.get("access_token")?.value;

  if (!token) return NextResponse.json({ contratos: [], message: "Não autorizado", error: true }, { status: 401 });

  const contratos: Contrato[] = await api.get("/contratos", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(
    {
      contratos,
      message: `${contratos.length} contratos encontrados!`,
      error: false,
    },
    { status: 200 },
  );
};

export const POST = async (req: NextRequest) => {
  const token = req.cookies.get("access_token")?.value;

  if (!token) return NextResponse.json({ contrato: null, message: "Não autorizado", error: true }, { status: 401 });

  let raw;

  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ contrato: null, message: "JSON inválido", error: true }, { status: 400 });
  }

  const parsed = contratoSchema.safeParse(raw);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);

    return NextResponse.json(
      {
        contrato: null,
        message: "Dados inválidos",
        errors: tree,
        error: true,
      },
      { status: 400 },
    );
  }

  const body: Contrato = parsed.data;

  const contrato: Contrato = await api.post("/contratos/upload", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(
    {
      contrato,
      message: "Contrato criado com sucesso!",
      error: false,
    },
    { status: 200 },
  );
};
