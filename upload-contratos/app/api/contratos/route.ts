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

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;

    if (!token) return NextResponse.json({ contratos: null, message: "Não autorizado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    const { data } = await api.get("/contratos", {
      params: { page, limit },
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json({ contratos: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ contratos: null, message: "Erro no servidor" }, { status: 500 });
  }
}

export const POST = async (req: NextRequest) => {
  const token = req.cookies.get("access_token")?.value;

  if (!token) return NextResponse.json({ contrato: null, message: "Não autorizado", error: true }, { status: 401 });

  let formData: FormData;

  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ contrato: null, message: "Form inválido", error: true }, { status: 400 });
  }

  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ contrato: null, message: "Arquivo não enviado", error: true }, { status: 400 });

  const backendForm = new FormData();
  backendForm.append("file", file);

  try {
    const { data } = await api.post("/contratos/upload", backendForm, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({ data, message: "Upload concluído!", error: false }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Backend upload error:", err?.response?.data ?? err);

    return NextResponse.json(
      {
        data: null,
        message: err?.response?.data?.message ?? "Erro ao enviar arquivo",
        error: true,
      },
      { status: err?.response?.status ?? 400 },
    );
  }
};
