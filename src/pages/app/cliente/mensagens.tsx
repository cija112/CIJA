import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "../../../components/sideBar/sideBar";
import styles from "./mensagens.module.css";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "Hooks/useDocumentTitle";

interface Mensagem {
  id_msg: string;
  id_ja: string;
  id_em: string;
  enviado_por_jovem: boolean;
  conteudo: string;
  data_envio: string;
}

interface Conversa {
  id_em: string;
  nome: string;
  avatar_url: string | null;
  ultima_msg?: string;
}

interface Usuario {
  avatar_url: string | null;
}

const Mensagens: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState<Usuario>({ avatar_url: null });
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [ativa, setAtiva] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const navigate = useNavigate();
  useDocumentTitle("Mensagens - Cliente");

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);

        const { data: jovem } = await supabase
          .from("jovem_aprendiz")
          .select("avatar_url")
          .eq("id_ja", data.user.id)
          .maybeSingle();

        if (jovem) setUserData({ avatar_url: jovem.avatar_url });
      }
    };
    init();
  }, []);

  const carregarConversas = useCallback(async () => {
    if (!userId) return;

    const { data } = await supabase
      .from("mensagens")
      .select("id_em, conteudo, data_envio,*")
      .eq("id_ja", userId)
      .order("data_envio", { ascending: false });

    if (!data) return;

    const idsUnicos = Array.from(new Set(data.map((m) => m.id_em)));

    const { data: empresas } = await supabase
      .from("empresa")
      .select("id_em,nome,avatarempresa_url")
      .in("id_em", idsUnicos);

    const lista: Conversa[] = idsUnicos.map((id) => {
      const empresa = empresas?.find((e) => e.id_em === id);
      const ultima = data.find((m) => m.id_em === id);

      return {
        id_em: id,
        nome: empresa?.nome || "Empresa",
        avatar_url: empresa?.avatarempresa_url || null,
        ultima_msg: ultima?.conteudo,
      };
    });

    setConversas(lista);
  }, [userId]);

  const abrir = useCallback(
    async (id_em: string) => {
      setAtiva(id_em);

      await supabase
        .from("mensagens")
        .update({ lida: true })
        .eq("id_ja", userId)
        .eq("id_em", id_em)
        .eq("enviado_por_jovem", false)
        .eq("lida", false);

      const { data } = await supabase
        .from("mensagens")
        .select("*")
        .eq("id_ja", userId)
        .eq("id_em", id_em)
        .order("data_envio", { ascending: true });

      setMensagens(data || []);
    },
    [userId],
  );

  async function enviar() {
    if (!texto.trim() || !ativa) return;

    const conteudoEnvio = texto;
    setTexto(""); // Limpa o input de forma fluida

    const { data, error } = await supabase
      .from("mensagens")
      .insert({
        id_ja: userId,
        id_em: ativa,
        conteudo: conteudoEnvio,
        enviado_por_jovem: true,
        lida: false,
        data_envio: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Erro ao enviar mensagem:", error);
      setTexto(conteudoEnvio);
      return;
    }

    if (data && data.length > 0) {
      setMensagens((prev) => {
        if (prev.some((m) => m.id_msg === data[0].id_msg)) return prev;
        return [...prev, data[0] as Mensagem];
      });
    }
  }

  // Tempo real via WebSocket (Supabase Realtime) para mensagens da conversa ativa
  useEffect(() => {
    if (!ativa || !userId) return;

    const channel = supabase
      .channel(`chat_jovem_${userId}_${ativa}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensagens",
          filter: `id_ja=eq.${userId}`,
        },
        (payload) => {
          const novaMsg = payload.new as Mensagem;
          if (novaMsg.id_em === ativa) {
            setMensagens((prev) => {
              if (prev.some((m) => m.id_msg === novaMsg.id_msg)) return prev;
              return [...prev, novaMsg];
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ativa, userId]);

  // Tempo real para atualizar a lista de conversas via WebSocket
  useEffect(() => {
    if (!userId) return;

    carregarConversas();

    const channelConversas = supabase
      .channel(`conversas_lista_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensagens",
          filter: `id_ja=eq.${userId}`,
        },
        () => {
          carregarConversas();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelConversas);
    };
  }, [userId, carregarConversas]);

  const irParaPerfil = (id_em: string) => {
    navigate(`/perfilEmpresa/${id_em}`);
  };

  const formatarDataHora = (dataStr: string) => {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    return (
      data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }) +
      " às " +
      data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const conversaAtual = conversas.find((c) => c.id_em === ativa);

  return (
    <div className={styles.container}>
      {!ativa ? (
        <>
          <div className={styles.sidebar}>
            <div className={styles.header}>Mensagens</div>

            <div className={styles.backButton} onClick={() => navigate(-1)}>
              ← Voltar
            </div>

            {conversas.map((c) => (
              <div
                key={c.id_em}
                className={styles.item}
                onClick={() => abrir(c.id_em)}
              >
                <img
                  src={c.avatar_url || "/avatar.png"}
                  alt={c.nome}
                  className={styles.avatar}
                />

                <div className={styles.info}>
                  <strong>{c.nome}</strong>
                  <p>{c.ultima_msg}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.empty}>
            <h2>Comece a conversar</h2>
            <p>Selecione uma conversa para visualizar as mensagens.</p>
          </div>
        </>
      ) : (
        <div className={styles.chat}>
          <div className={styles.top}>
            {/* Botão de voltar com setinha profissional, visível tanto no mobile quanto no PC */}
            <button
              className={styles.btnVoltarChat}
              onClick={() => setAtiva(null)}
              title="Voltar para conversas"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>

            <div
              className={styles.perfilClicavel}
              onClick={() =>
                conversaAtual?.id_em && irParaPerfil(conversaAtual.id_em)
              }
            >
              <img
                src={conversaAtual?.avatar_url || "/avatar.png"}
                alt={conversaAtual?.nome}
                className={styles.chatAvatar}
              />
              <div className={styles.perfilInfo}>
                <h3>{conversaAtual?.nome}</h3>
                <span className={styles.verPerfil}>Ver perfil</span>
              </div>
            </div>
          </div>

          <div className={styles.msgs}>
            {mensagens.map((m) => (
              <div
                key={m.id_msg}
                className={
                  m.enviado_por_jovem ? styles.msgRowRight : styles.msgRowLeft
                }
              >
                {!m.enviado_por_jovem && (
                  <img
                    src={conversaAtual?.avatar_url || "/avatar.png"}
                    alt="Empresa"
                    className={styles.msgAvatar}
                  />
                )}
                <div
                  className={
                    m.enviado_por_jovem ? styles.msgRight : styles.msgLeft
                  }
                >
                  <div className={styles.msgTexto}>{m.conteudo}</div>
                  <span className={styles.msgData}>
                    {formatarDataHora(m.data_envio)}
                  </span>
                </div>
                {m.enviado_por_jovem && (
                  <img
                    src={userData.avatar_url || "/avatar.png"}
                    alt="Você"
                    className={styles.msgAvatar}
                  />
                )}
              </div>
            ))}
          </div>

          <div className={styles.input}>
            <input
              value={texto}
              maxLength={2000}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Mensagem..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  enviar();
                }
              }}
            />

            <button onClick={enviar}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mensagens;
