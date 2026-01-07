import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { api } from "../..";

const loginSchema = z.object({
  usuario: z.string().min(1, "O campo 'usuario' é obrigatório"),
  senha: z.string().min(6, "O campo 'senha' deve ter pelo menos 6 caracteres"),
});

export const POST = async (req: NextRequest) => {
  let raw;

  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ usuario: null, message: "JSON inválido", error: true }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(raw);

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

  const body = parsed.data;

  try {
    const { data } = await api.post("/login", body);

    const token = data?.access_token;

    if (!token)
      return NextResponse.json({ usuario: null, message: "Token não retornado", error: true }, { status: 500 });

    const res = NextResponse.json(
      { usuario: data.user, message: "Login realizado com sucesso!", error: false },
      { status: 200 },
    );

    res.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      {
        usuario: null,
        message: err?.response?.data?.message ?? "Credenciais inválidas",
        error: true,
      },
      { status: 401 },
    );
  }
};
