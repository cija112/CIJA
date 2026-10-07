import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import styles from "./preEntrevista.module.css";
import { SidebarEmpresa } from "../../../components/sideBar/sideBarEmpresa";
import { useDocumentTitle } from "Hooks/useDocumentTitle";
import taskListImg from "../../../assets/taskList.png";

// Ícones SVG
const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const PencilIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const EyeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const LightbulbIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
  </svg>
);

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const MoreVerticalIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);

const AnimatedCheckmark = () => (
  <svg
    className={styles.checkmarkSvg}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

interface Pergunta {
  id?: string;
  created_at?: string;
  form_id?: string;
  question_text: string;
  type: string;
  category?: string;
  options?: string[];
}

interface Formulario {
  id: string;
  id_em: string;
  created_at: string;
  title: string;
  description: string;
  cargo?: string;
  questions?: Pergunta[];
}

const TIPOS_PERGUNTA = [
  { value: "text", label: "Texto curto" },
  { value: "textarea", label: "Texto longo" },
  { value: "radio", label: "Escolha única" },
  { value: "select", label: "Lista de opções" },
  { value: "checkbox", label: "Múltipla escolha" },
];

const SUGESTOES_POR_CARGO: Record<string, Pergunta[]> = {
  "Desenvolvedor Full Stack": [
    {
      question_text:
        "Qual a sua experiência com desenvolvimento em projetos reais?",
      type: "textarea",
      category: "Técnica",
    },
    {
      question_text:
        "Quais linguagens e frameworks você domina no Front-end e Back-end?",
      type: "textarea",
      category: "Técnica",
    },
    {
      question_text:
        "Descreva um desafio técnico complexo que você resolveu recentemente.",
      type: "textarea",
      category: "Técnica",
    },
    {
      question_text:
        "Como você lida com prazos apertados e priorização de bugs no código?",
      type: "text",
      category: "Comportamental",
    },
    {
      question_text:
        "Como você garante a qualidade e segurança do seu código antes de ir para produção?",
      type: "textarea",
      category: "Técnica",
    },
  ],
  "Estágio em Marketing": [
    {
      question_text:
        "Avalia comunicação, criatividade e interesse na área de marketing, ideal para vagas de estágio.",
      type: "textarea",
      category: "Comportamental",
    },
    {
      question_text:
        "Quais redes sociais você já gerenciou ou tem mais afinidade de criação?",
      type: "text",
      category: "Técnica",
    },
    {
      question_text:
        "Quais ferramentas de edição de imagem/vídeo ou métricas você já utilizou?",
      type: "textarea",
      category: "Técnica",
    },
    {
      question_text:
        "Descreva uma ideia criativa de campanha que você gostaria de colocar em prática.",
      type: "textarea",
      category: "Comportamental",
    },
  ],
  "Analista de Suporte": [
    {
      question_text:
        "Foca em habilidades de atendimento, resolução de problemas e conhecimento técnico básico.",
      type: "textarea",
      category: "Comportamental",
    },
    {
      question_text:
        "Como você lida com usuários frustrados ou em situações de alta pressão?",
      type: "textarea",
      category: "Comportamental",
    },
    {
      question_text:
        "Qual a sua experiência com ferramentas de chamados/tickets (Ex: Zendesk, Jira)?",
      type: "text",
      category: "Técnica",
    },
    {
      question_text:
        "Descreva os passos para diagnosticar uma falha de conexão ou erro no sistema.",
      type: "textarea",
      category: "Técnica",
    },
    {
      question_text:
        "Como você organiza sua fila de atendimentos quando há chamados urgentes simultâneos?",
      type: "text",
      category: "Comportamental",
    },
    {
      question_text:
        "Você possui disponibilidade para escala de plantão no suporte?",
      type: "radio",
      category: "Técnica",
    },
  ],
};

export const PreEntrevistas: React.FC = () => {
  useDocumentTitle("CIJA - Pré-Entrevistas");

  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<"minhas" | "modelos">("minhas");
  // Inicia com a aba "todas" selecionada por padrão
  const [filterSuggestionTab, setFilterSuggestionTab] = useState<
    "sugestoes" | "minhas" | "todas"
  >("todas");

  const [editingForm, setEditingForm] = useState<Formulario | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formParaExcluir, setFormParaExcluir] = useState<Formulario | null>(
    null,
  );

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cargo, setCargo] = useState("Desenvolvedor Full Stack");
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);

  const mostrarMensagem = (
    msg: string,
    tipo: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message: msg, type: tipo });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const calcularTempoEstimado = (numPerguntas: number): number => {
    return Math.max(numPerguntas * 2, 5);
  };

  const formatarData = (dataStr?: string) => {
    if (!dataStr) return "Data não disponível";
    const data = new Date(dataStr);
    if (isNaN(data.getTime())) return "Data não disponível";
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isApenasNumerosOuVazio = (texto: string) => {
    const limpo = texto.trim();
    if (!limpo) return true;
    return /^\d+$/.test(limpo);
  };

  useEffect(() => {
    buscarUsuario();
  }, []);

  async function buscarUsuario() {
    try {
      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Usuário não encontrado.");
        return;
      }

      setUserId(user.id);
      await carregarFormularios(user.id);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    } finally {
      setLoading(false);
    }
  }

  async function carregarFormularios(empresaId: string) {
    try {
      const { data: forms, error: formsError } = await supabase
        .from("forms")
        .select("*")
        .eq("id_em", empresaId)
        .order("created_at", { ascending: false });

      if (formsError) throw formsError;

      if (!forms || forms.length === 0) {
        const modelosPadrao: Formulario[] = [
          {
            id: "1",
            id_em: empresaId,
            created_at: new Date().toISOString(),
            title: "Desenvolvedor Full Stack",
            description:
              "Perguntas focadas em experiência técnica, resolução de problemas e soft skills para a vaga de Desenvolvedor Full Stack.",
            cargo: "Desenvolvedor Full Stack",
            questions: SUGESTOES_POR_CARGO["Desenvolvedor Full Stack"],
          },
          {
            id: "2",
            id_em: empresaId,
            created_at: new Date().toISOString(),
            title: "Estágio em Marketing",
            description:
              "Avalia comunicação, criatividade e interesse na área de marketing, ideal para vagas de estágio.",
            cargo: "Estágio em Marketing",
            questions: SUGESTOES_POR_CARGO["Estágio em Marketing"],
          },
          {
            id: "3",
            id_em: empresaId,
            created_at: new Date().toISOString(),
            title: "Analista de Suporte",
            description:
              "Foca em habilidades de atendimento, resolução de problemas e conhecimento técnico básico.",
            cargo: "Analista de Suporte",
            questions: SUGESTOES_POR_CARGO["Analista de Suporte"],
          },
        ];

        setFormularios(modelosPadrao);
        return;
      }

      const formsComPerguntas: Formulario[] = [];

      for (const form of forms) {
        const { data: questions, error: questionsError } = await supabase
          .from("form_questions")
          .select("*")
          .eq("form_id", form.id)
          .order("created_at", { ascending: true });

        if (questionsError) throw questionsError;

        formsComPerguntas.push({
          ...form,
          questions: (questions || []).map((q) => ({
            ...q,
            category: q.category || "Técnica",
            options: Array.isArray(q.options) ? q.options : [],
          })),
        });
      }

      setFormularios(formsComPerguntas);
    } catch (error) {
      console.error("Erro ao carregar pré-entrevistas:", error);
    }
  }

  function abrirFormulario(
    formulario: Formulario | null = null,
    apenasVisualizar = false,
  ) {
    setIsReadOnly(apenasVisualizar);
    setFilterSuggestionTab("todas");

    if (formulario) {
      setEditingForm(formulario);
      setTitle(formulario.title);
      setDescription(formulario.description || "");
      const cargoAtual = formulario.cargo || "Desenvolvedor Full Stack";
      setCargo(cargoAtual);

      setPerguntas(
        formulario.questions?.map((q) => ({
          id: q.id,
          question_text: q.question_text,
          type: q.type || "text",
          category: q.category || "Técnica",
          options: q.options || [],
        })) ||
          SUGESTOES_POR_CARGO[cargoAtual] ||
          [],
      );
    } else {
      setEditingForm(null);
      setTitle("Pré-entrevista - Desenvolvedor");
      setDescription(
        "Explique o objetivo desta pré-entrevista, como ela será utilizada e o que você espera dos candidatos.",
      );
      setCargo("Desenvolvedor Full Stack");
      setPerguntas(SUGESTOES_POR_CARGO["Desenvolvedor Full Stack"]);
    }

    setViewMode("form");
  }

  function aplicarSugestoesDoCargo(novoCargo: string) {
    setCargo(novoCargo);
    if (SUGESTOES_POR_CARGO[novoCargo]) {
      setPerguntas([...SUGESTOES_POR_CARGO[novoCargo]]);
    }
  }

  function voltarParaLista() {
    setViewMode("list");
    setEditingForm(null);
    setIsReadOnly(false);
  }

  function adicionarPergunta() {
    if (isReadOnly) return;
    setPerguntas((prev) => [
      ...prev,
      {
        question_text: "",
        type: "text",
        category: "Técnica",
        options: [],
      },
    ]);
  }

  function removerPergunta(index: number) {
    if (isReadOnly) return;
    setPerguntas((prev) => prev.filter((_, i) => i !== index));
  }

  function atualizarPergunta(index: number, campo: keyof Pergunta, valor: any) {
    if (isReadOnly) return;
    setPerguntas((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [campo]: valor } : p)),
    );
  }

  async function salvarFormulario(e: React.FormEvent) {
    e.preventDefault();

    if (isReadOnly) return;

    if (isApenasNumerosOuVazio(title)) {
      mostrarMensagem(
        "O título não pode conter apenas números ou ficar em branco.",
        "error",
      );
      return;
    }

    if (description.trim() && isApenasNumerosOuVazio(description)) {
      mostrarMensagem("A descrição não pode conter apenas números.", "error");
      return;
    }

    if (perguntas.length === 0) {
      mostrarMensagem("Adicione pelo menos uma pergunta.", "error");
      return;
    }

    for (let i = 0; i < perguntas.length; i++) {
      if (isApenasNumerosOuVazio(perguntas[i].question_text)) {
        mostrarMensagem(
          `A pergunta ${
            i + 1
          } é inválida. Não pode ser vazia ou apenas números.`,
          "error",
        );
        return;
      }
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        mostrarMensagem("Sessão expirada. Faça login novamente.", "error");
        return;
      }

      let formId = editingForm?.id;

      if (!editingForm) {
        const { data: novoForm, error: formError } = await supabase
          .from("forms")
          .insert([
            {
              id_em: user.id,
              title: title.trim(),
              description: description.trim(),
            },
          ])
          .select()
          .single();

        if (formError) throw formError;
        formId = novoForm.id;
      } else {
        const { error: formError } = await supabase
          .from("forms")
          .update({
            title: title.trim(),
            description: description.trim(),
          })
          .eq("id", editingForm.id)
          .eq("id_em", user.id);

        if (formError) throw formError;
      }

      if (!formId)
        throw new Error("Não foi possível identificar o formulário.");

      if (editingForm) {
        await supabase.from("form_questions").delete().eq("form_id", formId);
      }

      const perguntasParaInserir = perguntas.map((p) => ({
        form_id: formId,
        question_text: p.question_text.trim(),
        type: p.type,
        options: p.options || [],
      }));

      const { error: questionsError } = await supabase
        .from("form_questions")
        .insert(perguntasParaInserir);

      if (questionsError) throw questionsError;

      mostrarMensagem(
        editingForm
          ? "Pré-entrevista atualizada com sucesso!"
          : "Pré-entrevista criada com sucesso!",
        "success",
      );

      voltarParaLista();
      await carregarFormularios(user.id);
    } catch (error: any) {
      console.error("Erro ao salvar pré-entrevista:", error);
      mostrarMensagem(
        `Não foi possível salvar: ${error.message || "Erro desconhecido"}`,
        "error",
      );
    }
  }

  async function excluirFormulario() {
    if (!formParaExcluir) return;

    try {
      const { error } = await supabase
        .from("forms")
        .delete()
        .eq("id", formParaExcluir.id)
        .eq("id_em", userId);

      if (error) throw error;

      mostrarMensagem("Pré-entrevista excluída com sucesso!", "success");
      setFormParaExcluir(null);
      setIsDeleteModalOpen(false);

      await carregarFormularios(userId);
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
      mostrarMensagem(
        `Erro ao excluir: ${error.message || "Erro desconhecido"}`,
        "error",
      );
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <SidebarEmpresa />
        <div className={styles.mainWrapper}>
          <main className={styles.content}>
            <div className={styles.loading}>Carregando pré-entrevistas...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <SidebarEmpresa />

      <div className={styles.mainWrapper}>
        <div className={styles.content}>
          {/* TOAST DE NOTIFICAÇÃO */}
          {toast.show && (
            <div className={styles.toastContainer}>
              <div
                className={
                  toast.type === "success"
                    ? styles.toastSuccess
                    : styles.toastError
                }
              >
                {toast.type === "success" ? (
                  <div className={styles.toastCheckIconBox}>
                    <AnimatedCheckmark />
                  </div>
                ) : (
                  <div className={styles.toastErrorIconBox}>!</div>
                )}
                <span>{toast.message}</span>
              </div>
            </div>
          )}

          {/* ===================================================================
              DASHBOARD / LISTA DE PRÉ-ENTREVISTAS
             =================================================================== */}
          {viewMode === "list" ? (
            <>
              {/* Header Banner */}
              <div className={styles.headerBanner}>
                <div className={styles.headerBannerLeft}>
                  <div className={styles.taskListIconBox}>
                    <img
                      src={taskListImg}
                      alt="Task List Icon"
                      className={styles.taskListImg}
                    />
                  </div>
                  <div className={styles.headerBannerText}>
                    <span className={styles.processoBadge}>
                      PROCESSO SELETIVO
                    </span>
                    <h1>Pré-Entrevistas</h1>
                    <p>
                      Crie e gerencie perguntas para serem respondidas pelos
                      candidatos antes da entrevista principal. Assim, você
                      filtra os perfis mais alinhados e economiza tempo no
                      processo seletivo.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.btnCriar}
                  onClick={() => abrirFormulario(null, false)}
                >
                  <PlusIcon />
                  <span>Criar Pré-Entrevista</span>
                </button>
              </div>

              {/* Abas */}
              <div className={styles.tabsArea}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${
                    activeTab === "minhas" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("minhas")}
                >
                  Minhas pré-entrevistas{" "}
                  <span className={styles.tabCount}>{formularios.length}</span>
                </button>
              </div>

              {/* Grid Principal */}
              <div className={styles.mainGrid}>
                <div className={styles.formsContainer}>
                  {formularios.length === 0 ? (
                    <div className={styles.semFormularios}>
                      <div className={styles.emptyIconBox}>
                        <img
                          src={taskListImg}
                          alt="Task List Icon"
                          className={styles.emptyTaskListImg}
                        />
                      </div>
                      <h2>Nenhuma pré-entrevista criada</h2>
                      <p>
                        Crie sua primeira pré-entrevista para começar a avaliar
                        candidatos.
                      </p>
                      <button
                        type="button"
                        className={styles.btnCriar}
                        onClick={() => abrirFormulario(null, false)}
                      >
                        <PlusIcon />
                        <span>Criar Pré-Entrevista</span>
                      </button>
                    </div>
                  ) : (
                    <div className={styles.formsGrid}>
                      {formularios.map((formulario) => {
                        const qtdPerguntas = formulario.questions?.length || 0;
                        const tempoEstimado =
                          calcularTempoEstimado(qtdPerguntas);

                        return (
                          <div key={formulario.id} className={styles.formCard}>
                            <h2 className={styles.cardTitle}>
                              {formulario.title}
                            </h2>

                            <span className={styles.dataTag}>
                              Criada em {formatarData(formulario.created_at)}
                            </span>

                            <p className={styles.description}>
                              {formulario.description ||
                                "Sem descrição informada."}
                            </p>

                            <div className={styles.cardStats}>
                              <div className={styles.statBadge}>
                                <span>
                                  {qtdPerguntas}{" "}
                                  {qtdPerguntas === 1
                                    ? "pergunta"
                                    : "perguntas"}
                                </span>
                              </div>
                              <div className={styles.statBadge}>
                                <span>~{tempoEstimado} min</span>
                              </div>
                            </div>

                            <div className={styles.acoesArea}>
                              <button
                                type="button"
                                className={styles.btnEditar}
                                onClick={() =>
                                  abrirFormulario(formulario, false)
                                }
                              >
                                <PencilIcon />
                                <span>Editar</span>
                              </button>

                              <button
                                type="button"
                                className={styles.btnVisualizar}
                                onClick={() =>
                                  abrirFormulario(formulario, true)
                                }
                              >
                                <EyeIcon />
                                <span>Visualizar</span>
                              </button>

                              <button
                                type="button"
                                className={styles.btnMais}
                                title="Excluir"
                                onClick={() => {
                                  setFormParaExcluir(formulario);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <MoreVerticalIcon />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Sidebar Dicas Rápidas */}
                <aside className={styles.quickTipsCard}>
                  <div className={styles.quickTipsHeader}>
                    <LightbulbIcon />
                    <h3>Dicas rápidas</h3>
                  </div>
                  <ul className={styles.quickTipsList}>
                    <li>
                      <div className={styles.checkBadge}>
                        <CheckIcon />
                      </div>
                      <span>
                        Use perguntas objetivas e relevantes para a vaga.
                      </span>
                    </li>
                    <li>
                      <div className={styles.checkBadge}>
                        <CheckIcon />
                      </div>
                      <span>
                        Mantenha o tempo de resposta entre 5 e 15 minutos.
                      </span>
                    </li>
                    <li>
                      <div className={styles.checkBadge}>
                        <CheckIcon />
                      </div>
                      <span>
                        Você pode reutilizar pré-entrevistas como modelo para
                        outras vagas.
                      </span>
                    </li>
                  </ul>
                </aside>
              </div>
            </>
          ) : (
            /* ===================================================================
               TELA DE CRIAR / EDITAR / VISUALIZAR PRÉ-ENTREVISTA
               =================================================================== */
            <div>
              <button
                type="button"
                className={styles.backBtn}
                onClick={voltarParaLista}
              >
                <ArrowLeftIcon />
                <span>Voltar</span>
              </button>

              <div className={styles.createHeader}>
                <div className={styles.createHeaderLeft}>
                  <h1>
                    {isReadOnly
                      ? "Visualizar Pré-entrevista"
                      : editingForm
                        ? "Editar Pré-entrevista"
                        : "Criar Pré-entrevista"}
                  </h1>
                  <p>
                    {isReadOnly
                      ? "Modo de visualização. Clique em 'Editar' para alterar as perguntas."
                      : "Monte uma pré-entrevista com perguntas estratégicas que serão aplicadas aos candidatos antes da entrevista principal."}
                  </p>
                </div>
                <div className={styles.createHeaderRight}>
                  <div className={styles.taskListIconBox}>
                    <img
                      src={taskListImg}
                      alt="Task List Graphic"
                      className={styles.taskListImg}
                    />
                  </div>
                </div>
              </div>

              <form onSubmit={salvarFormulario}>
                <div className={styles.editorAndPreviewGrid}>
                  {/* Coluna Esquerda */}
                  <div className={styles.editorColumn}>
                    {/* Passo 1 */}
                    <div className={styles.stepBlock}>
                      <div className={styles.stepHeader}>
                        <span className={styles.stepNumber}>1</span>
                        <div>
                          <h3>Informações básicas</h3>
                          <p>
                            Dê um nome e uma descrição para sua pré-entrevista.
                          </p>
                        </div>
                      </div>

                      <div className={styles.rowInputs}>
                        <div className={styles.inputGroup}>
                          <label>Título da pré-entrevista *</label>
                          <input
                            type="text"
                            value={title}
                            disabled={isReadOnly}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Pré-entrevista - Desenvolvedor"
                            required
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label>Cargo da vaga *</label>
                          <select
                            value={cargo}
                            disabled={isReadOnly}
                            onChange={(e) =>
                              aplicarSugestoesDoCargo(e.target.value)
                            }
                          >
                            <option value="Desenvolvedor Full Stack">
                              Desenvolvedor Full Stack
                            </option>
                            <option value="Estágio em Marketing">
                              Estágio em Marketing
                            </option>
                            <option value="Analista de Suporte">
                              Analista de Suporte
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Descrição (opcional)</label>
                        <textarea
                          value={description}
                          disabled={isReadOnly}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Explique o objetivo desta pré-entrevista, como ela será utilizada e o que você espera dos candidatos."
                          rows={3}
                          maxLength={1000}
                        />
                        <span className={styles.contador}>
                          {description.length} / 1000
                        </span>
                      </div>
                    </div>

                    {/* Passo 2 */}
                    <div className={styles.stepBlock}>
                      <div className={styles.stepHeaderBetween}>
                        <div className={styles.stepHeader}>
                          <span className={styles.stepNumber}>2</span>
                          <div>
                            <h3>Perguntas</h3>
                            <p>
                              Selecione ou adicione as perguntas que farão parte
                              da pré-entrevista.
                            </p>
                          </div>
                        </div>

                        {!isReadOnly && (
                          <button
                            type="button"
                            className={styles.btnAdicionarPergunta}
                            onClick={adicionarPergunta}
                          >
                            <PlusIcon />
                            <span>Adicionar pergunta</span>
                          </button>
                        )}
                      </div>

                      {/* Filtros das Perguntas com "Todas" por padrão */}
                      <div className={styles.filterTabs}>
                        <button
                          type="button"
                          className={`${styles.filterTab} ${
                            filterSuggestionTab === "sugestoes"
                              ? styles.activeFilterTab
                              : ""
                          }`}
                          onClick={() => {
                            setFilterSuggestionTab("sugestoes");
                            if (!isReadOnly) aplicarSugestoesDoCargo(cargo);
                          }}
                        >
                          ✩ Sugestões da vaga
                        </button>
                        <button
                          type="button"
                          className={`${styles.filterTab} ${
                            filterSuggestionTab === "minhas"
                              ? styles.activeFilterTab
                              : ""
                          }`}
                          onClick={() => setFilterSuggestionTab("minhas")}
                        >
                          Minhas perguntas
                        </button>
                        <button
                          type="button"
                          className={`${styles.filterTab} ${
                            filterSuggestionTab === "todas"
                              ? styles.activeFilterTab
                              : ""
                          }`}
                          onClick={() => setFilterSuggestionTab("todas")}
                        >
                          Todas
                        </button>
                      </div>

                      <div className={styles.questionsList}>
                        {perguntas.map((p, index) => (
                          <div
                            key={p.id || index}
                            className={styles.questionItemCard}
                          >
                            <div className={styles.questionCardTop}>
                              <div className={styles.questionTagAndIndex}>
                                <span className={styles.questionIndexLabel}>
                                  PERGUNTA {index + 1}
                                </span>
                              </div>

                              {!isReadOnly && perguntas.length > 1 && (
                                <button
                                  type="button"
                                  className={styles.btnRemoverPergunta}
                                  onClick={() => removerPergunta(index)}
                                >
                                  <TrashIcon />
                                  <span>Remover</span>
                                </button>
                              )}
                            </div>

                            <div className={styles.inputGroup}>
                              <label>Digite a pergunta *</label>
                              <input
                                type="text"
                                value={p.question_text}
                                disabled={isReadOnly}
                                onChange={(e) =>
                                  atualizarPergunta(
                                    index,
                                    "question_text",
                                    e.target.value,
                                  )
                                }
                                placeholder="Ex: Qual a sua experiência com desenvolvimento em projetos reais?"
                                required
                              />
                            </div>

                            <div className={styles.rowInputs}>
                              <div className={styles.inputGroup}>
                                <label>Tipo de resposta</label>
                                <select
                                  value={p.type}
                                  disabled={isReadOnly}
                                  onChange={(e) =>
                                    atualizarPergunta(
                                      index,
                                      "type",
                                      e.target.value,
                                    )
                                  }
                                >
                                  {TIPOS_PERGUNTA.map((t) => (
                                    <option key={t.value} value={t.value}>
                                      {t.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className={styles.inputGroup}>
                                <label>Categoria</label>
                                <select
                                  value={p.category || "Técnica"}
                                  disabled={isReadOnly}
                                  onChange={(e) =>
                                    atualizarPergunta(
                                      index,
                                      "category",
                                      e.target.value,
                                    )
                                  }
                                >
                                  <option value="Técnica">Técnica</option>
                                  <option value="Comportamental">
                                    Comportamental
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Coluna Direita (Preview Ao Vivo) */}
                  <aside className={styles.previewColumn}>
                    <div className={styles.previewCard}>
                      <div className={styles.previewHeader}>
                        <div>
                          <h3>Pré-entrevista</h3>
                          <p>
                            Visualize como será a ordem das perguntas para o
                            candidato.
                          </p>
                        </div>
                        <span className={styles.previewBadgeCount}>
                          {perguntas.length}{" "}
                          {perguntas.length === 1 ? "pergunta" : "perguntas"}
                        </span>
                      </div>

                      <div className={styles.previewQuestionsContainer}>
                        {perguntas.map((p, idx) => (
                          <div key={idx} className={styles.previewQuestionItem}>
                            <div className={styles.previewQuestionNumber}>
                              {idx + 1}
                            </div>
                            <div className={styles.previewQuestionBody}>
                              <p className={styles.previewQuestionText}>
                                {p.question_text.trim()
                                  ? p.question_text
                                  : `Pergunta ${idx + 1}...`}
                              </p>
                              <span className={styles.previewCategoryTag}>
                                {p.category || "Técnica"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className={styles.previewTipBox}>
                        <InfoIcon />
                        <div>
                          <strong>Dica</strong>
                          <p>
                            Você pode alterar a ordem das perguntas, adicionar
                            mais questões ou removê-las a qualquer momento antes
                            de salvar.
                          </p>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>

                {/* Rodapé do Form */}
                <div className={styles.formFooterActions}>
                  <span className={styles.footerCountText}>
                    {perguntas.length}{" "}
                    {perguntas.length === 1
                      ? "pergunta configurada"
                      : "perguntas configuradas"}
                  </span>

                  <div className={styles.footerBtnsRight}>
                    <button
                      type="button"
                      className={styles.btnCancelar}
                      onClick={voltarParaLista}
                    >
                      {isReadOnly ? "Voltar" : "Cancelar"}
                    </button>

                    {isReadOnly ? (
                      <button
                        type="button"
                        className={styles.btnSalvar}
                        onClick={() => setIsReadOnly(false)}
                      >
                        Editar Pré-entrevista
                      </button>
                    ) : (
                      <button type="submit" className={styles.btnSalvar}>
                        Salvar Pré-entrevista
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Modal de Exclusão */}
          {isDeleteModalOpen && formParaExcluir && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalDelete}>
                <h3>Excluir Pré-Entrevista</h3>
                <p>
                  Deseja excluir a pré-entrevista{" "}
                  <strong>{formParaExcluir.title}</strong>?
                </p>
                <p className={styles.warning}>
                  Esta ação não pode ser desfeita.
                </p>
                <div className={styles.modalDeleteActions}>
                  <button
                    type="button"
                    className={styles.btnCancelar}
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setFormParaExcluir(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className={styles.btnConfirmarDeletar}
                    onClick={excluirFormulario}
                  >
                    Sim, Excluir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PreEntrevistas;
