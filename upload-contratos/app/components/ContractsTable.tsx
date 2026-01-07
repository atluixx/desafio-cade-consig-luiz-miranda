import { Contrato } from "../(private)/dashboard/types";

export default function ContractsTable({ contratos }: { contratos: Contrato[] }) {
  const formatMoney = (v?: number) =>
    v == null ? "-" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b bg-muted/60 text-xs uppercase text-muted-foreground">
          <th className="text-left py-2 px-3">ID</th>
          <th className="text-left py-2 px-3">Nome</th>
          <th className="text-left py-2 px-3">E-mail</th>
          <th className="text-left py-2 px-3">Plano</th>
          <th className="text-left py-2 px-3">Valor</th>
          <th className="text-left py-2 px-3">Status</th>
          <th className="text-left py-2 px-3">Data início</th>
        </tr>
      </thead>

      <tbody>
        {contratos.map((c) => (
          <tr key={c.id} className="border-b last:border-0">
            <td className="py-2 px-3 font-mono text-xs truncate max-w-35">{c.id}</td>
            <td className="py-2 px-3">{c.nome}</td>
            <td className="py-2 px-3">{c.email}</td>
            <td className="py-2 px-3">{c.plano}</td>
            <td className="py-2 px-3">{formatMoney(c.valor)}</td>
            <td className="py-2 px-3">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  c.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {c.status}
              </span>
            </td>
            <td className="py-2 px-3">{new Date(c.data_inicio).toLocaleDateString("pt-BR")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
