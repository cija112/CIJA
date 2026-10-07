import React, { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  UserPlus,
  Users,
  Building2,
  User,
  Filter,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";
// Importando a Sidebar correta exclusiva para empresas (remove a caixa de completar perfil)
import { SidebarEmpresa } from "../../../../components/sideBar/sideBarEmpresa";
// Mantendo a estilização original exatamente como no arquivo original
import styles from "../../cliente/buscarUsers/buscarUser.module.css";
import { useDocumentTitle } from "Hooks/useDocumentTitle";
import { supabase } from "supabaseClient";
import { useNavigate } from "react-router-dom";

export interface SearchItem {
  id: string;
  type: "jovem_aprendiz" | "empresa";
  name: string;
  subtitle: string;
  location: string;
  email: string;
  telefone: string;
  avatar: string;
}

const categories = [
  { name: "Todos", icon: Users },
  { name: "Jovens Aprendizes", icon: User },
  { name: "Empresas", icon: Building2 },
];

export default function SearchBar() {
  useDocumentTitle("CIJA - Buscar Jovens e Empresas");
  const [activeTab, setActiveTab] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado EXCLUSIVO para a empresa logada
  const [companyAvatar, setCompanyAvatar] = useState<string>("");

  const navigate = useNavigate();
  const defaultAvatar =
    "https://www.gravatar.com/avatar/00000000000000?d=mp&f=y";

  const getAvatarUrl = (path: string | null) => {
    if (!path || path.trim() === "" || path.includes("placeholder.com")) {
      return "";
    }
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const cleanPath = path.replace(/^\/+/, "").replace(/^avatars\//, "");
    const { data } = supabase.storage.from("avatars").getPublicUrl(cleanPath);

    return data?.publicUrl || "";
  };

  const getEmAvatar = (path: string | null) => {
    if (!path || path.trim() === "") return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    const cleanPath = path.replace(/^\/+/, "").replace(/^empresas\//, "");
    const { data } = supabase.storage.from("avatars").getPublicUrl(cleanPath);
    return data?.publicUrl || "";
  };

  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const {
          data: { user: loggedUser },
        } = await supabase.auth.getUser();

        if (loggedUser) {
          // Busca EXCLUSIVAMENTE na tabela de empresas
          const { data: empresaData } = await supabase
            .from("empresa")
            .select("id_em, avatarempresa_url")
            .eq("id_em", loggedUser.id)
            .maybeSingle();

          if (empresaData?.avatarempresa_url) {
            setCompanyAvatar(getEmAvatar(empresaData.avatarempresa_url));
          }
        }

        // Busca todos os jovens e empresas para preencher a lista de pesquisa
        const [jaResponse, empresaResponse, curriculoResponse] =
          await Promise.all([
            supabase
              .from("jovem_aprendiz")
              .select("id_ja, nome, email, telefone, avatar_url,endereco"),
            supabase
              .from("empresa")
              .select(
                "id_em, nome, cnpj, email, telefone, descricao,endereco,avatarempresa_url",
              ),
            supabase.from("curriculo_ja").select("id_ja,descricao"),
          ]);

        const curriculo = curriculoResponse.data || [];

        if (jaResponse.error) {
          console.error(
            "Erro ao procurar Jovens Aprendizes:",
            jaResponse.error,
          );
        }
        if (empresaResponse.error) {
          console.error("Erro ao procurar Empresas:", empresaResponse.error);
        }

        const mappedJovens: SearchItem[] = (jaResponse.data || []).map(
          (u: any) => {
            const curriucloJa = curriculo.find(
              (c: any) => String(c.id_ja) === String(u.id_ja),
            );
            const descOrigin =
              curriucloJa?.descricao || "Nenhuma descrição inserida.";
            const descCortada =
              descOrigin.length > 90
                ? `${descOrigin.slice(0, 60)}...`
                : descOrigin;
            return {
              id: String(u.id_ja),
              type: "jovem_aprendiz",
              name: u.nome || "Jovem Aprendiz",
              subtitle: descCortada,
              email: u.email || "",
              telefone: u.telefone || "",
              avatar: getAvatarUrl(u.avatar_url),
              location: u.endereco
                ? `${u.endereco} `
                : u.endereco || "Não informado",
            };
          },
        );

        const mappedEmpresas: SearchItem[] = (empresaResponse.data || []).map(
          (e: any) => ({
            id: String(e.id_em),
            type: "empresa",
            name: e.nome || "Empresa",
            subtitle:
              e.descricao && e.descricao.length > 90
                ? `${e.descricao.slice(0, 90)}...`
                : e.descricao || "Nenhuma descrição inserida.",
            email: e.email || "",
            telefone: e.telefone || "",
            avatar: getEmAvatar(e.avatarempresa_url),
            location: e.endereco
              ? `${e.endereco} `
              : e.endereco || "Não informado",
          }),
        );

        setItems([...mappedJovens, ...mappedEmpresas]);
      } catch (err) {
        console.error("Erro inesperado ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, []);

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const locQuery = locationQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query);

    const matchesLocation =
      !locQuery || item.location.toLowerCase().includes(locQuery);

    const matchesTab =
      activeTab === "Todos" ||
      (activeTab === "Jovens Aprendizes" && item.type === "jovem_aprendiz") ||
      (activeTab === "Empresas" && item.type === "empresa");

    return matchesSearch && matchesLocation && matchesTab;
  });

  const irParaPerfil = (id: string, type: "jovem_aprendiz" | "empresa") => {
    if (!id) return;
    if (type === "jovem_aprendiz") {
      navigate(`/perfil/${id}`);
    } else {
      navigate(`/perfilEmpresa/${id}`);
    }
  };

  return (
    <div className={styles.app}>
      {/* Utilizando o componente de menu lateral exclusivo para empresas */}
      <SidebarEmpresa />

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Buscar no Sistema</h1>
            <p>Encontre jovens aprendizes e empresas parceiras cadastradas.</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userCardHeader}>
              {companyAvatar ? (
                <img
                  src={companyAvatar}
                  alt="Avatar da Empresa logada"
                  onClick={() => navigate(`/perfilEmpresa`)}
                  className={styles.userHeaderAvatar}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultAvatar;
                  }}
                />
              ) : (
                <Building2
                  size={20}
                  color="#ffffff"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/perfilEmpresa`)}
                />
              )}
            </div>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          <div className={styles.centerPanel}>
            <div className={styles.searchBarWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Nome, e-mail, empresa ou localização..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SlidersHorizontal size={18} className={styles.filterIcon} />
            </div>

            <div className={styles.categoriesTabs}>
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`${styles.tabBtn} ${
                    activeTab === category.name ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab(category.name)}
                >
                  <category.icon size={16} />
                  {category.name}
                </button>
              ))}
            </div>

            <div className={styles.resultsMeta}>
              <span>{filteredItems.length} resultados encontrados</span>
            </div>

            <div className={styles.usersList}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  Carregando usuários aguarde...
                </div>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className={styles.userCard}
                  >
                    <div className={styles.userCardLeft}>
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          onClick={() => irParaPerfil(item.id, item.type)}
                          className={
                            item.type === "empresa"
                              ? styles.companyAvatar
                              : styles.userAvatar
                          }
                          onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src = defaultAvatar;
                          }}
                        />
                      ) : (
                        <div
                          className={`${styles.userAvatarFallback} ${
                            item.type === "empresa"
                              ? styles.fallbackEmpresa
                              : styles.fallbackJovem
                          }`}
                          onClick={() => irParaPerfil(item.id, item.type)}
                        >
                          {item.type === "empresa" ? (
                            <Building2 size={24} color="#a1a1aa" />
                          ) : (
                            <User size={24} color="#a1a1aa" />
                          )}
                        </div>
                      )}

                      <div className={styles.userInfo}>
                        <div className={styles.userNameRow}>
                          <h3>{item.name}</h3>
                          <span
                            className={
                              item.type === "empresa"
                                ? styles.badgeEmpresa
                                : styles.badgeJa
                            }
                          >
                            {item.type === "empresa"
                              ? "Empresa"
                              : "Jovem Aprendiz"}
                          </span>
                        </div>

                        <p className={styles.userRole}>{item.subtitle}</p>

                        <div className={styles.userMetaInfo}>
                          {item.location !== "Não informada" && (
                            <p className={styles.userLocation}>
                              <MapPin size={13} />
                              {item.location}
                            </p>
                          )}
                          {item.email && (
                            <p className={styles.userLocation}>
                              <Mail size={13} />
                              {item.email}
                            </p>
                          )}
                          {item.telefone && (
                            <p className={styles.userLocation}>
                              <Phone size={13} />
                              {item.telefone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.userCardActions}>
                      <div className={styles.actionsButtons}>
                        <button className={styles.connectBtn}>
                          {item.type === "empresa" ? (
                            <>
                              <Briefcase size={16} />
                              <span>Ver Vagas</span>
                            </>
                          ) : (
                            <>
                              <UserPlus size={16} />
                              <span>Conectar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyContainer}>
                  Nenhum jovem ou empresa encontrado.
                </div>
              )}
            </div>
          </div>

          <aside className={styles.filterSidebar}>
            <div className={styles.filterHeader}>
              <h2>Filtros</h2>
              <button
                className={styles.clearFilters}
                onClick={() => {
                  setSearchQuery("");
                  setLocationQuery("");
                  setActiveTab("Todos");
                }}
              >
                Limpar tudo
              </button>
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterGroupTitle}>Tipo de Registro</h3>
              <select
                className={styles.filterSelect}
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Jovens Aprendizes">Jovens Aprendizes</option>
                <option value="Empresas">Empresas</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterGroupTitle}>Localização</h3>
              <div className={styles.filterInputWrapper}>
                <MapPin size={16} className={styles.inputLeftIcon} />
                <input
                  type="text"
                  placeholder="Cidade, estado ou região"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
            </div>

            <button className={styles.applyFiltersBtn}>
              <Filter size={16} />
              Aplicar filtros
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
