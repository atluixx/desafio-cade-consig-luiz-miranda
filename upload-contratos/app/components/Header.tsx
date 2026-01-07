"use client";

import { JSX } from "react";
import { Button } from "@/components/ui/button";

export default function Header(): JSX.Element {
  return (
    <header className="w-full px-8 py-4 flex justify-end gap-3">
      <Button
        variant="ghost"
        onClick={() => {
          window.location.href = "/login";
        }}
      >
        Entrar
      </Button>
      <Button
        onClick={() => {
          window.location.href = "/register";
        }}
      >
        Registrar
      </Button>
    </header>
  );
}
