import { useState, useEffect, useMemo } from "react";
import { fetchSearchItems } from "services/searchService";
import { SearchItem } from "types/search";

export function useSearch() {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");
  const [loading, setloading] = useState(true);

  // Procura os dados apenas uma vez quando o componente e montado
  useEffect(() => {
    fetchSearchItems()
      .then((data) => setItems(data))
      .catch((err) => console.error("Erro ao carregar dados: ", err))
      .finally(() => setloading(false));
  }, []);

  //atualiza tab sempre q muda a pesquisa
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return items.filter((item) => {
      const matchesSearch =
        item.name.toLocaleLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query);

      const matchesTab =
        activeTab === "Todos" ||
        (activeTab === "Jovens Aprendizes" && item.type === "jovem_aprendiz") ||
        (activeTab === "Empresas" && item.type === "empresa");

      return matchesSearch && matchesTab;
    });
  }, [items, searchQuery, activeTab]);

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filteredItems,
    loading
  };
}
