import { supabase } from "supabaseClient";
import { SearchItem } from "types/search";

export async function fetchSearchItems(): Promise<SearchItem[]> {
  //executa 2 funcoes nas 2 tabela de ja e empresa
  const [jaResponse, empresaResponse] = await Promise.all([
    supabase
      .from("jovem_aprendiz")
      .select(
        "id_ja, nome, email, telefone, cargo, avatar_url",
      ),
    supabase
      .from("empresa")
      .select("id_empresa, nome, cnpj, email, telefone, descricao"),
  ]);

  // Transforma Jovens Aprendizes no modelo normalizado
  const jovens: SearchItem[] = (jaResponse.data || []).map((u: any) => ({
    id: u.id_ja,
    type: "jovem_aprendiz",
    name: u.nome || "Jovem Aprendiz",
    subtitle: u.cargo || "Candidato",
    email: u.email || "",
    telefone: u.telefone || "",
    location:
      u.cidade && u.estado ? `${u.cidade} - ${u.estado}` : "Não informada",
    avatar: u.avatar_url || "",
  }));

  // Transforma Empresas no modelo normalizado
  const empresas: SearchItem[] = (empresaResponse.data || []).map((e: any) => ({
    id: e.id_empresa,
    type: "empresa",
    name: e.nome || "Empresa",
    subtitle: e.descricao || (e.cnpj ? `CNPJ: ${e.cnpj}` : "Empresa Parceira"),
    email: e.email || "",
    telefone: e.telefone || "",
    location: "Não informada",
    avatar: "",
  }));

  return [...jovens, ...empresas];
}
