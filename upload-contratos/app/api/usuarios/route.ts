import { NextRequest, NextResponse } from "next/server";
import { api } from "..";
import { z } from "zod";

const usuarioSchema = z.object({
  usuario: z.string().min(1, "O campo 'usuario' é obrigatório"),
  senha: z.string().min(6, "O campo 'senha' deve ter pelo menos 6 caracteres"),
});

type Usuario = z.infer<typeof usuarioSchema>;

export const GET = async (req: NextRequest) => {
  const token = req.cookies.get("access_token")?.value;

  if (!token) return NextResponse.json({ usuarios: [], message: "Não autorizado", error: true }, { status: 401 });

  const { data: usuarios } = await api.get<Usuario[]>("/usuarios", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(
    {
      usuarios,
      message: `${usuarios.length} usuários encontrados!`,
      error: false,
    },
    { status: 200 },
  );
};

export const POST = async (req: NextRequest) => {
  const token = req.cookies.get("access_token")?.value;

  if (!token) return NextResponse.json({ usuario: null, message: "Não autorizado", error: true }, { status: 401 });

  let raw;

  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ usuario: null, message: "JSON inválido", error: true }, { status: 400 });
  }

  const parsed = usuarioSchema.safeParse(raw);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);

    return NextResponse.json(
      {
        usuario: null,
        message: "Dados inválidos",
        errors: tree,
        error: true,
      },
      { status: 400 },
    );
  }

  const body: Usuario = parsed.data;

  const { data: usuario } = await api.post<Usuario>("/usuarios", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(
    {
      usuario,
      message: "Usuário criado com sucesso!",
      error: false,
    },
    { status: 201 },
  );
};
