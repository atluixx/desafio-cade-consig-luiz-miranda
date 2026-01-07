import { JSX } from "react";
import { Button } from "@/components/ui/button";

export default function Header(): JSX.Element {
  return (
    <header className="w-full px-8 py-4 flex justify-end gap-3">
      <Button variant="ghost">Entrar</Button>
      <Button>Registrar</Button>
    </header>
  );
}
