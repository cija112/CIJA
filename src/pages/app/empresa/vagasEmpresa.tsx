import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import styles from "./vagasEmpresa.module.css";
import { SidebarEmpresa } from "../../../components/sideBar/sideBarEmpresa";
import { useDocumentTitle } from "Hooks/useDocumentTitle";
import { useSafeInput } from "../../../Hooks/userSafeInput"; 
import {
  Search,
  Plus,
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
  Briefcase,
  X,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react";

interface Vaga {
  id_vag: string;
  id_em: string;
  titulo: string;
  descricao: string;
  carga_horaria: number;
  salario: number;
  data_publicada: string;
  cidade: string;
  estado: string;
  tipo: string;
  contrato: string;
}

interface Notification {
  id: number;
  message: string;
  type: "success" | "error";
}

const DADOS_BRASIL: Record<string, string[]> = {
  AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó"],
  AL: ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "Penedo"],
  AP: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoke", "Porto Grande"],
  AM: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari"],
  BA: [
    "Salvador",
    "Feira de Santana",
    "Vitória da Conquista",
    "Camaçari",
    "Itabuna",
    "Lauro de Freitas",
    "Ilhéus",
    "Jequié",
  ],
  CE: [
    "Fortaleza",
    "Caucaia",
    "Juazeiro do Norte",
    "Maracanaú",
    "Sobral",
    "Crato",
  ],
  DF: ["Brasília"],
  ES: [
    "Vitória",
    "Vila Velha",
    "Serra",
    "Cariacica",
    "Guarapari",
    "Linhares",
    "Cachoeiro de Itapemirim",
  ],
  GO: [
    "Goiânia",
    "Aparecida de Goiânia",
    "Anápolis",
    "Rio Verde",
    "Senador Canedo",
    "Itumbiara",
  ],
  MA: [
    "São Luís",
    "Imperatriz",
    "São José de Ribamar",
    "Timon",
    "Caxias",
    "Codó",
  ],
  MT: [
    "Cuiabá",
    "Várzea Grande",
    "Rondonópolis",
    "Sinop",
    "Tangará da Serra",
    "Cáceres",
  ],
  MS: [
    "Campo Grande",
    "Dourados",
    "Três Lagoas",
    "Corumbá",
    "Ponta Porã",
    "Sidrolândia",
  ],
  MG: [
    "Belo Horizonte",
    "Uberlândia",
    "Contagem",
    "Juiz de Fora",
    "Betim",
    "Montes Claros",
    "Uberaba",
    "Governador Valadares",
  ],
  PA: [
    "Belém",
    "Ananindeua",
    "Santarém",
    "Marabá",
    "Parauapebas",
    "Castanhal",
    "Abaetetuba",
  ],
  PB: [
    "João Pessoa",
    "Campina Grande",
    "Santa Rita",
    "Patos",
    "Bayeux",
    "Sousa",
  ],
  PR: [
    "Curitiba",
    "Londrina",
    "Maringá",
    "Ponta Grossa",
    "Cascavel",
    "São José dos Pinhais",
    "Foz do Iguaçu",
  ],
  PE: [
    "Recife",
    "Jaboatão dos Guararapes",
    "Olinda",
    "Caruaru",
    "Petrolina",
    "Paulista",
    "Cabo de Santo Agostinho",
  ],
  PI: ["Teresina", "Parnaíba", "Picos", "Floriano", "Barras", "Piripiri"],
  RJ: [
    "Rio de Janeiro",
    "São Gonçalo",
    "Duque de Caxias",
    "Nova Iguaçu",
    "Niterói",
    "Belford Roxo",
    "São João de Meriti",
    "Campos dos Goytacazes",
    "Petrópolis",
  ],
  RN: [
    "Natal",
    "Mossoró",
    "Parnamirim",
    "São Gonçalo do Amarante",
    "Macaíba",
    "Ceará-Mirim",
  ],
  RS: [
    "Porto Alegre",
    "Caxias do Sul",
    "Pelotas",
    "Canoas",
    "Santa Maria",
    "Gravataí",
    "Viamão",
    "Novo Hamburgo",
  ],
  RO: [
    "Porto Velho",
    "Ji-Paraná",
    "Ariquemes",
    "Vilhena",
    "Cacoal",
    "Rolim de Moura",
  ],
  RR: ["Boa Vista", "Rorainópolis", "Caracaraí", "Mucajaí", "Alto Alegre"],
  SC: [
    "Florianópolis",
    "Joinville",
    "Blumenau",
    "São José",
    "Criciúma",
    "Chapecó",
    "Itajaí",
    "Jaraguá do Sul",
  ],
  SP: [
    "São Paulo",
    "Guarulhos",
    "Campinas",
    "Paulínia",
    "São Bernardo do Campo",
    "Santo André",
    "São José dos Campos",
    "Ribeirão Preto",
    "Osasco",
    "Sorocaba",
    "Mauá",
    "Sumaré",
    "Cosmópolis",
    "Santos",
    "Jundiaí",
  ],
  SE: [
    "Aracaju",
    "Nossa Senhora do Socorro",
    "Lagarto",
    "Itabaiana",
    "São Cristóvão",
  ],
  TO: [
    "Palmas",
    "Araguaína",
    "Gurupi",
    "Porto Nacional",
    "Paraíso do Tocantins",
  ],
};

const TIPOS_VALIDOS = ["Presencial", "Remoto", "Híbrido"];
const CONTRATOS_VALIDOS = ["CLT", "PJ", "Estágio", "Temporário"];

export const VagasEmpresa: React.FC = () => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");
  const [isVagaOpen, setIsVagaOpen] = useState<boolean>(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] =
    useState<boolean>(false);
  const [editingVaga, setEditingVaga] = useState<Vaga | null>(null);
  const [originalVagaValues, setOriginalVagaValues] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Search and filter state
  const [busca, setBusca] = useState<string>("");
  const [filtroTipo, setFiltroTipo] = useState<string>("Todas as vagas");

  // Step wizard state
  const [step, setStep] = useState<number>(1);
  const [shakeModal, setShakeModal] = useState<boolean>(false);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Hook for Safe Input on Title (max 40 chars, blocks letter spam)
  const {
    value: titulo,
    onChange: handleTituloChange,
    setValue: setTitulo,
  } = useSafeInput("", 40);

  // Form fields
  const [descricao, setDescricao] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState<number>(0);
  const [salario, setSalario] = useState<number>(0);
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [tipo, setTipo] = useState("");
  const [contrato, setContrato] = useState("");

  useDocumentTitle("CIJA - Vagas da Empresa");

  useEffect(() => {
    buscarEmpresasEVagas();
  }, []);

  function notify(message: string, type: "success" | "error") {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }

  function triggerShake() {
    setShakeModal(true);
    setTimeout(() => setShakeModal(false), 400);
  }

  async function buscarEmpresasEVagas() {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await carregarVagas(user.id);
      }
    } catch (err) {
      notify("Erro ao carregar dados da empresa.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function carregarVagas(empresaId: string) {
    const { data, error } = await supabase
      .from("vaga")
      .select("*")
      .eq("id_em", empresaId)
      .order("data_publicada", { ascending: false });

    if (!error && data) {
      setVagas(data as Vaga[]);
    }
  }

  function abrirVaga(vaga: Vaga | null = null) {
    if (vaga) {
      if (loading) return;
      try {
        setEditingVaga(vaga);
        setTitulo(vaga.titulo);
        setDescricao(vaga.descricao);
        setCargaHoraria(vaga.carga_horaria);
        setSalario(vaga.salario);
        setEstado(vaga.estado);
        setCidade(vaga.cidade);
        setTipo(vaga.tipo);
        setContrato(vaga.contrato);
        setOriginalVagaValues({
          titulo: vaga.titulo,
          descricao: vaga.descricao,
          carga_horaria: vaga.carga_horaria,
          salario: vaga.salario,
          estado: vaga.estado,
          cidade: vaga.cidade,
          tipo: vaga.tipo,
          contrato: vaga.contrato,
        });
      } catch (e) {
        notify("Aguarde para carregar os dados da vaga", "error");
      }
    } else {
      setEditingVaga(null);
      setTitulo("");
      setDescricao("");
      setCargaHoraria(0);
      setSalario(0);
      setEstado("");
      setCidade("");
      setTipo("");
      setContrato("");
      setOriginalVagaValues(null);
    }
    setStep(1);
    setIsVagaOpen(true);
  }

  function validarCamposVaga(): boolean {
    if (!titulo.trim()) {
      triggerShake();
      notify("O título da vaga é obrigatório.", "error");
      return false;
    }

    if (!descricao.trim()) {
      triggerShake();
      notify("A descrição da vaga é obrigatória.", "error");
      return false;
    }

    if (Number(cargaHoraria) < 1 || Number(cargaHoraria) > 100) {
      triggerShake();
      notify(
        "A carga horária deve estar entre 1 e 100 horas semanais.",
        "error",
      );
      return false;
    }

    if (Number(salario) < 0 || Number(salario) > 30000) {
      triggerShake();
      notify("O salário deve estar entre R$ 0,00 e R$ 30.000,00.", "error");
      return false;
    }

    if (!estado.trim() || !DADOS_BRASIL[estado]) {
      triggerShake();
      notify("Selecione um estado válido.", "error");
      return false;
    }

    if (!cidade.trim() || !DADOS_BRASIL[estado]?.includes(cidade)) {
      triggerShake();
      notify("Selecione uma cidade válida para o estado escolhido.", "error");
      return false;
    }

    if (!tipo.trim() || !TIPOS_VALIDOS.includes(tipo)) {
      triggerShake();
      notify("Selecione um tipo de vaga válido.", "error");
      return false;
    }

    if (!contrato.trim() || !CONTRATOS_VALIDOS.includes(contrato)) {
      triggerShake();
      notify("Selecione um tipo de contrato válido.", "error");
      return false;
    }

    return true;
  }

  async function salvarVaga(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validarCamposVaga()) {
      return;
    }

    if (editingVaga && originalVagaValues) {
      const houveMudanca =
        originalVagaValues.titulo !== titulo.trim() ||
        originalVagaValues.descricao !== descricao.trim() ||
        originalVagaValues.carga_horaria !== Number(cargaHoraria) ||
        originalVagaValues.salario !== Number(salario) ||
        originalVagaValues.estado !== estado.trim() ||
        originalVagaValues.cidade !== cidade.trim() ||
        originalVagaValues.tipo !== tipo ||
        originalVagaValues.contrato !== contrato;

      if (!houveMudanca) {
        triggerShake();
        notify("Nenhuma alteração foi realizada na vaga.", "error");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        notify("Sessão expirada. Faça login novamente.", "error");
        return;
      }

      const dadosVaga = {
        id_em: user.id,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        carga_horaria: Number(cargaHoraria),
        salario: Number(salario),
        estado: estado.trim(),
        cidade: cidade.trim(),
        tipo,
        contrato,
      };

      if (editingVaga) {
        const { error } = await supabase
          .from("vaga")
          .update(dadosVaga)
          .eq("id_vag", editingVaga.id_vag);

        if (error) throw error;
        notify("Vaga atualizada com sucesso!", "success");
      } else {
        const { error } = await supabase
          .from("vaga")
          .insert([{ ...dadosVaga, data_publicada: new Date().toISOString() }]);

        if (error) throw error;
        notify("Vaga publicada com sucesso!", "success");
      }

      setIsVagaOpen(false);
      carregarVagas(user.id);
    } catch (err: any) {
      triggerShake();
      notify(`Erro ao salvar vaga: ${err.message || "Erro interno"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deletarVaga() {
    if (!editingVaga) return;

    try {
      const { error } = await supabase
        .from("vaga")
        .delete()
        .eq("id_vag", editingVaga.id_vag);

      if (error) throw error;

      notify("Vaga removida com sucesso!", "success");
      setIsConfirmDeleteOpen(false);
      setIsVagaOpen(false);
      setEditingVaga(null);
      if (userId) {
        carregarVagas(userId);
      }
    } catch (err: any) {
      triggerShake();
      notify(`Erro ao remover vaga: ${err.message || "Erro interno"}`, "error");
    }
  }

  const vagasFiltradas = vagas.filter((vaga) => {
    const textoBusca = busca.toLowerCase();
    const matchTituloOuDesc =
      vaga.titulo.toLowerCase().includes(textoBusca) ||
      vaga.descricao.toLowerCase().includes(textoBusca);

    const matchTipo =
      filtroTipo === "Todas as vagas" ||
      !filtroTipo ||
      vaga.tipo.toLowerCase() === filtroTipo.toLowerCase();

    return matchTituloOuDesc && matchTipo;
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <SidebarEmpresa />
        <div className={styles.mainWrapper}>
          <main
            className={styles.content}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "18px", color: "#a855f7", fontWeight: 600 }}>
              Carregando vagas...
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <SidebarEmpresa />

      <div className={styles.toastContainer}>
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`${styles.toast} ${n.type === "success" ? styles.toastSuccess : styles.toastError}`}
          >
            {n.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{n.message}</span>
          </div>
        ))}
      </div>

      <div className={styles.mainWrapper}>
        <main className={styles.content}>
          <div className={styles.headerArea}>
            <div className={styles.headerTop}>
              <div>
                <h1>Vagas Cadastradas</h1>
                <p>
                  Gerencie e acompanhe todas as vagas publicadas pela
                  empresa
                </p>
              </div>
            </div>

            <div className={styles.searchFilterBar}>
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon}>
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Buscar vaga por título ou descrição..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <select
                className={styles.filterSelect}
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="Todas as vagas">Todas as vagas</option>
                <option value="Presencial">Presencial</option>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
              </select>

              <button className={styles.btnCriar} onClick={() => abrirVaga()}>
                <Plus size={16} /> Criar Nova Vaga
              </button>
            </div>
          </div>

          {vagas.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrapper}>
                <Briefcase size={32} />
              </div>
              <h3>Nenhuma vaga criada</h3>
              <p>
                Nenhuma vaga foi cadastrada ainda. Clique no botão abaixo para
                criar a primeira oportunidade.
              </p>
              <button
                className={styles.btnCriar}
                onClick={() => abrirVaga()}
                style={{ marginLeft: 0 }}
              >
                <Plus size={16} /> Clique aqui para criar
              </button>
            </div>
          ) : (
            <div className={styles.vagasList}>
              {vagasFiltradas.length === 0 ? (
                <p
                  style={{
                    color: "#94a3b8",
                    fontStyle: "italic",
                    padding: "12px 0",
                  }}
                >
                  Nenhuma vaga encontrada com os filtros informados.
                </p>
              ) : (
                vagasFiltradas.map((vaga) => {
                  return (
                    <div key={vaga.id_vag} className={styles.cardVaga}>
                      <div className={styles.cardTopRow}>
                        <div className={styles.cardLeftInfo}>
                          <div className={styles.cardTitleBadges}>
                            <h2>{vaga.titulo}</h2>
                            <div className={styles.badgesRow}>
                              {vaga.contrato && (
                                <span className={styles.badge}>
                                  {vaga.contrato}
                                </span>
                              )}
                              {vaga.tipo && (
                                <span className={styles.badge}>
                                  {vaga.tipo}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={styles.cardRightInfo}>
                          <span className={styles.dataTag}>
                            {new Date(vaga.data_publicada).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                          <button
                            className={styles.btnArrow}
                            onClick={() => abrirVaga(vaga)}
                            title="Editar / Ver detalhes da vaga"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>

                      <p className={styles.descricaoText}>{vaga.descricao}</p>

                      <div className={styles.cardMetaRow}>
                        <div className={styles.metaItem}>
                          <Clock size={15} />{" "}
                          <span>{vaga.carga_horaria}h semanais</span>
                        </div>
                        <div className={styles.metaItem}>
                          <DollarSign size={15} />{" "}
                          <span>
                            {Number(vaga.salario).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className={styles.metaItem}>
                          <MapPin size={15} />{" "}
                          <span>
                            {vaga.cidade}, {vaga.estado}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {isVagaOpen && (
            <div className={styles.modalOverlay}>
              <div
                className={`${styles.modalContainer} ${shakeModal ? styles.shake : ""}`}
              >
                <div className={styles.modalHeaderTop}>
                  <div>
                    <h2>
                      {editingVaga
                        ? "Detalhes e Edição da Oportunidade"
                        : "Publicar Nova Vaga"}
                    </h2>
                    <p>
                      Preencha os dados abaixo para{" "}
                      {editingVaga
                        ? "atualizar ou remover a"
                        : "publicar uma nova"}{" "}
                      oportunidade.
                    </p>
                  </div>
                  <button
                    className={styles.btnCloseModal}
                    onClick={() => setIsVagaOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className={styles.stepperContainer}>
                  <div className={styles.stepDivider}></div>
                  <div
                    className={`${styles.stepItem} ${step === 1 ? styles.active : step > 1 ? styles.completed : ""}`}
                  >
                    <div className={styles.stepCircle}>1</div>
                    <span className={styles.stepLabel}>Informações Gerais</span>
                  </div>
                  <div
                    className={`${styles.stepItem} ${step === 2 ? styles.active : step > 2 ? styles.completed : ""}`}
                  >
                    <div className={styles.stepCircle}>2</div>
                    <span className={styles.stepLabel}>Detalhes da Vaga</span>
                  </div>
                  <div
                    className={`${styles.stepItem} ${step === 3 ? styles.active : ""}`}
                  >
                    <div className={styles.stepCircle}>3</div>
                    <span className={styles.stepLabel}>
                      Revisão e Publicação
                    </span>
                  </div>
                </div>

                <form onSubmit={salvarVaga} className={styles.vagaForm}>
                  {step === 1 && (
                    <div className={styles.stepSectionBox}>
                      <h3>Informações Gerais</h3>
                      <p>Preencha as informações básicas da vaga.</p>

                      <div className={styles.inputGroup}>
                        <label>
                          Título da Vaga 
                        </label>
                        <input
                          type="text"
                          placeholder="Ex.: Desenvolvedor Front-end Pleno"
                          value={titulo}
                          onChange={handleTituloChange}
                          required
                        />
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            textAlign: "right",
                            marginTop: "2px",
                          }}
                        >
                          {titulo.length} / 40
                        </span>
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Descrição da Atividade</label>
                        <textarea
                          placeholder="Descreva as principais atividades e responsabilidades da vaga..."
                          value={descricao}
                          onChange={(e) => setDescricao(e.target.value)}
                          rows={5}
                          maxLength={2000}
                          required
                        />
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            textAlign: "right",
                            marginTop: "2px",
                          }}
                        >
                          {descricao.length} / 2000
                        </span>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className={styles.stepSectionBox}>
                      <h3>Detalhes da Vaga e Localização</h3>
                      <p>
                        Informe carga horária, salário, estado e cidade de forma
                        segura.
                      </p>

                      <div className={styles.rowInputs}>
                        <div className={styles.inputGroup}>
                          <label>Carga Horária (1 a 100h/semana)</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            placeholder="Ex.: 40"
                            value={cargaHoraria || ""}
                            onChange={(e) =>
                              setCargaHoraria(Number(e.target.value))
                            }
                            required
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label>Salário Mensal (R$ máx. 30.000,00)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="30000"
                            placeholder="Ex.: 3500,00"
                            value={salario || ""}
                            onChange={(e) => setSalario(Number(e.target.value))}
                            required
                          />
                        </div>
                      </div>

                      <div
                        className={styles.rowInputs}
                        style={{ marginTop: "16px" }}
                      >
                        <div className={styles.inputGroup}>
                          <label>Estado (UF)</label>
                          <select
                            value={estado}
                            onChange={(e) => {
                              setEstado(e.target.value);
                              setCidade(""); // Reseta a cidade ao trocar o estado
                            }}
                            required
                          >
                            <option value="">Selecione o Estado</option>
                            {Object.keys(DADOS_BRASIL).map((uf) => (
                              <option key={uf} value={uf}>
                                {uf}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className={styles.inputGroup}>
                          <label>Cidade</label>
                          <select
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            disabled={!estado}
                            required
                          >
                            <option value="">
                              {estado
                                ? "Selecione a Cidade"
                                : "Selecione o Estado primeiro"}
                            </option>
                            {estado &&
                              DADOS_BRASIL[estado]?.map((mun) => (
                                <option key={mun} value={mun}>
                                  {mun}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <div
                        className={styles.stepSectionBox}
                        style={{
                          marginTop: "16px",
                          marginBottom: 0,
                          backgroundColor: "#161122",
                        }}
                      >
                        <h3 style={{ fontSize: "14px" }}>Configurações</h3>
                        <p style={{ fontSize: "11px" }}>
                          Selecione o tipo de vaga e o modelo de contratação.
                        </p>

                        <div className={styles.rowInputs}>
                          <div className={styles.inputGroup}>
                            <label>Tipo de Vaga</label>
                            <select
                              value={tipo}
                              onChange={(e) => setTipo(e.target.value)}
                              required
                            >
                              <option value="">Selecione o tipo de vaga</option>
                              <option value="Presencial">Presencial</option>
                              <option value="Remoto">Remoto</option>
                              <option value="Híbrido">Híbrido</option>
                            </select>
                          </div>
                          <div className={styles.inputGroup}>
                            <label>Tipo de Contrato</label>
                            <select
                              value={contrato}
                              onChange={(e) => setContrato(e.target.value)}
                              required
                            >
                              <option value="">
                                Selecione o tipo de contrato
                              </option>
                              <option value="CLT">CLT</option>
                              <option value="PJ">PJ</option>
                              <option value="Estágio">Estágio</option>
                              <option value="Temporário">Temporário</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className={styles.stepSectionBox}>
                      <h3>Revisão e Publicação</h3>
                      <p>
                        Confira os dados preenchidos antes de salvar/publicar.
                      </p>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          color: "#cbd5e1",
                          fontSize: "13px",
                        }}
                      >
                        <div>
                          <strong>Título:</strong> {titulo || "Não informado"}
                        </div>
                        <div>
                          <strong>Descrição:</strong>{" "}
                          {descricao || "Não informada"}
                        </div>
                        <div>
                          <strong>Carga Horária & Salário:</strong>{" "}
                          {cargaHoraria ? `${cargaHoraria}h semanais` : "-"} /{" "}
                          {salario
                            ? `R$ ${Number(salario).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                            : "-"}
                        </div>
                        <div>
                          <strong>Localização:</strong>{" "}
                          {cidade && estado
                            ? `${cidade} - ${estado}`
                            : "Não informada"}
                        </div>
                        <div>
                          <strong>Modelo & Contrato:</strong> {tipo || "-"} /{" "}
                          {contrato || "-"}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.modalAcoes}>
                    {editingVaga ? (
                      <button
                        type="button"
                        className={styles.btnDeletarModal}
                        onClick={() => setIsConfirmDeleteOpen(true)}
                      >
                        <Trash2 size={16} /> Excluir Vaga
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className={styles.modalAcoesRight}>
                      {step > 1 && (
                        <button
                          type="button"
                          className={styles.btnAnterior}
                          onClick={() => setStep(step - 1)}
                        >
                          Anterior
                        </button>
                      )}

                      {step === 1 && (
                        <button
                          type="button"
                          className={styles.btnCancelar}
                          onClick={() => setIsVagaOpen(false)}
                        >
                          Cancelar
                        </button>
                      )}

                      {step < 3 ? (
                        <button
                          type="button"
                          className={styles.btnProximo}
                          onClick={() => {
                            if (step === 1) {
                              if (!titulo.trim()) {
                                triggerShake();
                                notify(
                                  "O título da vaga é obrigatório.",
                                  "error",
                                );
                                return;
                              }
                              if (!descricao.trim()) {
                                triggerShake();
                                notify(
                                  "A descrição da vaga é obrigatória.",
                                  "error",
                                );
                                return;
                              }
                            }
                            setStep(step + 1);
                          }}
                        >
                          Próximo &rarr;
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className={styles.btnSalvarForm}
                          disabled={isSubmitting}
                        >
                          {editingVaga ? "Salvar Alterações" : "Publicar Vaga"}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isConfirmDeleteOpen && (
            <div className={styles.modalOverlay} style={{ zIndex: 1100 }}>
              <div
                className={`${styles.modalContainer} ${styles.modalAlerta} ${shakeModal ? styles.shake : ""}`}
              >
                <h3>Confirmar Exclusão</h3>
                <p>
                  Tem certeza que deseja excluir permanentemente a vaga{" "}
                  <strong>{editingVaga?.titulo}</strong>? Esta ação não poderá
                  ser desfeita.
                </p>
                <div className={styles.modalAcoes}>
                  <button
                    type="button"
                    className={styles.btnCancelar}
                    onClick={() => setIsConfirmDeleteOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className={styles.btnConfirmarDeletar}
                    onClick={deletarVaga}
                  >
                    Sim, Excluir Vaga
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VagasEmpresa;
