"use client";

import { JSX } from "react";
import Icon from "feather-icons-react";
import { Button } from "@/components/ui/button";

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl w-full space-y-10">
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Sistema de Contratos</h1>
          <p className="text-slate-600 text-sm">Fluxo simples do aplicativo:</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="border rounded-lg p-4 flex flex-col items-center gap-3">
            <Icon icon="upload" size={28} />
            <span className="font-semibold text-center">1. Importar CSV</span>
          </div>

          <div className="border rounded-lg p-4 flex flex-col items-center gap-3">
            <Icon icon="check-circle" size={28} />
            <span className="font-semibold text-center">2. Validar dados</span>
          </div>

          <div className="border rounded-lg p-4 flex flex-col items-center gap-3">
            <Icon icon="bar-chart-2" size={28} />
            <span className="font-semibold text-center">3. Ver Dashboard</span>
          </div>

          <div className="border rounded-lg p-4 flex flex-col items-center gap-3">
            <Icon icon="activity" size={28} />
            <span className="font-semibold text-center">4. Acompanhar</span>
          </div>
        </section>

        <div className="text-center">
          <Button asChild>
            <a href="/dashboard">Ir para o Dashboard</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
