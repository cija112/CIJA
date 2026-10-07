export type SearchItemType = "jovem_aprendiz" | "empresa";

export interface SearchItem {
  id: string;
  type: SearchItemType;
  name: string;
  subtitle: string;
  email: string;
  telefone: string;
  location: string;
  avatar?: string;
}
