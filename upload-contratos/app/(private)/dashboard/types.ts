export type Contrato = {
  nome: string;
  email: string;
  plano: string;
  valor: number;
  status: string;
  data_inicio: string;
};

export type PageResponse = {
  items: Contrato[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};
