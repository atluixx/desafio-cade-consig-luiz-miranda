import { StatusBadge } from "./StatusBadge";
import type { Contrato } from "../(private)/dashboard/types";

export default function ContractsTable({ contratos }: { contratos: Contrato[] }) {
  const formatMoney = (v?: number) =>
    v == null ? "-" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
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
  );
}
