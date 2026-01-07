import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Filters(props: any) {
  const {
    nome,
    setNome,
    email,
    setEmail,
    plano,
    setPlano,
    status,
    setStatus,
    valorFiltro,
    setValorFiltro,
    dataInicio,
    setDataInicio,
    dataTexto,
    setDataTexto,
    aplicar,
    limpar,
    loading,
  } = props;

  const [displayDate, setDisplayDate] = useState(dataTexto ? dataTexto.split("-").reverse().join("-") : "");

  const formatMask = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 8)
      .replace(/(\d{2})(\d)/, "$1-$2")
      .replace(/(\d{2})-(\d{2})(\d)/, "$1-$2-$3");

  const handleManualDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatMask(e.target.value);
    setDisplayDate(masked);

    const digits = masked.replace(/\D/g, "");

    if (digits.length === 8) {
      const d = digits.slice(0, 2);
      const m = digits.slice(2, 4);
      const y = digits.slice(4, 8);

      const api = `${y}-${m}-${d}`;
      setDataTexto(api);

      const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
      setDataInicio(dateObj);
    } else {
      setDataTexto("");
      setDataInicio(undefined);
    }
  };

  const handleCalendarSelect = (date?: Date) => {
    setDataInicio(date);

    if (!date) {
      setDisplayDate("");
      setDataTexto("");
      return;
    }

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    const api = `${y}-${m}-${d}`;
    setDataTexto(api);
    setDisplayDate(`${d}-${m}-${y}`);
  };

  return (
    <section className="border rounded-lg p-4 space-y-4">
      <h2 className="font-medium">Filtros</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input placeholder="Nome do cliente" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Input placeholder="Email do cliente" value={email} onChange={(e) => setEmail(e.target.value)} />

        <Select value={plano} onValueChange={setPlano}>
          <SelectTrigger>
            <SelectValue placeholder="Plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Basico">Básico</SelectItem>
            <SelectItem value="Pro">Pro</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ATIVO">Ativo</SelectItem>
            <SelectItem value="INATIVO">Inativo</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Valor mensal (R$)"
          value={valorFiltro}
          onChange={(e) => setValorFiltro(e.target.value)}
        />

        <div className="flex gap-2">
          <Input placeholder="dd-MM-YYYY" value={displayDate} onChange={handleManualDate} />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {displayDate || "Selecionar"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0">
              <Calendar mode="single" selected={dataInicio} onSelect={handleCalendarSelect} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={aplicar} disabled={loading}>
          Aplicar filtros
        </Button>
        <Button variant="outline" onClick={limpar}>
          Limpar filtros
        </Button>
      </div>
    </section>
  );
}
