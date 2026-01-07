import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { api } from "..";

export const contratoSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório"),
  email: z.email("E-mail inválido").trim(),
  plano: z.enum(["Basico", "Pro", "Enterprise"], {
    message: "Plano inválido",
  }),
  valor: z.coerce
    .number({
      error: "Valor deve ser um número",
    })
    .positive("Valor deve ser maior que 0"),
  status: z.enum(["Ativo", "Inativo"], {
    message: "Status inválido",
  }),
  data_inicio: z
    .string()
    .trim()
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Data deve estar no formato YYYY-MM-DD")
    .refine((v) => !isNaN(new Date(v).getTime()), "Data inválida"),
});

type Contrato = z.infer<typeof contratoSchema>;

export const GET = async (req: NextRequest) => {
  const token = req.cookies.get("access_token")?.value;

  if (!token) return NextResponse.json({ contratos: [], message: "Não autorizado", error: true }, { status: 401 });

  const { data: contratos } = await api.get<Contrato[]>("/contratos", {
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

  const body = parsed.data;

  const { data: contrato } = await api.post<Contrato>("/contratos/upload", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(
    {
      contrato,
      message: "Contrato criado com sucesso!",
      error: false,
    },
    { status: 201 },
  );
};
