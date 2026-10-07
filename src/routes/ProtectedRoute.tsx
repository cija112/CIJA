import { useEffect, useState, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "supabaseClient";

type TipoUsuario = "jovem_aprendiz" | "empresa";

interface ProtectedRouteProps {
  children: ReactNode;
  tipoEsperado: TipoUsuario | TipoUsuario[];
}

// Função para calcular o percentual do perfil
function calcularPercentualPerfil(ja: any, curr: any) {
  if (!ja) return 0;
  let pts = 0;

  if (ja?.avatar_url || ja?.avatar || ja?.foto) pts += 15;
  if ((ja?.nome || "").trim().length > 3) pts += 5;
  if (ja?.email) pts += 5;
  if ((ja?.telefone || "").replace(/\D/g, "").length >= 10) pts += 5;
  if ((ja?.cpf || "").replace(/\D/g, "").length >= 11) pts += 5;

  const desc = (curr?.descricao || "").trim().length;

  if (desc >= 100) pts += 20;
  else if (desc >= 50) pts += 15;
  else if (desc >= 20) pts += 8;
  else if (desc > 0) pts += 3;

  const skills = (curr?.competencias || "")
    .split(",")
    .filter((s: string) => s.trim()).length;

  pts += Math.min(skills * 3, 15);

  try {
    const f = JSON.parse(curr?.curso || "[]");
    if (Array.isArray(f) && f.length) {
      pts += f.length >= 2 ? 15 : 10;
    }
  } catch {}

  try {
    const e = JSON.parse(curr?.experiencias || "{}").experiencias || [];
    pts += e.length >= 2 ? 15 : e.length === 1 ? 10 : 0;
  } catch {}

  return Math.min(pts, 100);
}

export default function ProtectedRoute({
  children,
  tipoEsperado,
}: ProtectedRouteProps) {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isJovem, setIsJovem] = useState(false);
  const [isEmpresa, setIsEmpresa] = useState(false);
  const [emailConfirmado, setEmailConfirmado] = useState(true);
  const [percentPerfil, setPercentPerfil] = useState<number | null>(null);
  const [timerConcluido, setTimerConcluido] = useState(false);

  const listaTipos = Array.isArray(tipoEsperado)
    ? tipoEsperado
    : [tipoEsperado];

  useEffect(() => {
    let mounted = true;

    async function checarIdentidade() {
      if (mounted) setLoading(true);

      try {
        // PEGAR A SESSÃO ATUAL
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !data.session?.user) {
          if (sessionError)
            console.error("Erro ao recuperar sessão:", sessionError);
          if (mounted) {
            setIsJovem(false);
            setIsEmpresa(false);
            setLoading(false);
          }
          return;
        }

        const user = data.session.user;
        const userId = user.id;
        const emailAuth = user.email?.trim().toLowerCase();
        const nomeAuth =
          user.user_metadata?.full_name || user.user_metadata?.name || "";

        if (mounted) {
          setIsJovem(false);
          setIsEmpresa(false);
          setEmailConfirmado(true);
          setPercentPerfil(null);
        }

        let jovem: any = null;
        let empresa: any = null;

        const exigeApenasEmpresa =
          listaTipos.length === 1 && listaTipos[0] === "empresa";

        //  VERIFICAÇÃO DE ACORDO COM O TIPO SOLICITADO OU AMBOS
        if (exigeApenasEmpresa) {
          // --- FLUXO EXCLUSIVO EMPRESA ---
          const { data: empresaPorId } = await supabase
            .from("empresa")
            .select("*")
            .eq("id_em", userId)
            .maybeSingle();

          empresa = empresaPorId || null;

          if (!empresa && emailAuth) {
            const { data: empresaPorEmail } = await supabase
              .from("empresa")
              .select("*")
              .eq("email", emailAuth)
              .maybeSingle();

            empresa = empresaPorEmail || null;
          }

          if (empresa) {
            if (mounted) {
              setIsEmpresa(true);
              setIsJovem(false);
              setLoading(false);
            }
            return;
          }

          // Fallback para verificar se é jovem tentando entrar em rota de empresa
          const { data: jovemAlt } = await supabase
            .from("jovem_aprendiz")
            .select("*")
            .or(`id_ja.eq.${userId},email.eq.${emailAuth || ""}`)
            .maybeSingle();

          if (jovemAlt && mounted) {
            setIsJovem(true);
            setIsEmpresa(false);
            setLoading(false);
            return;
          }
        } else {
          // --- FLUXO JOVEM APRENDIZ---
          const { data: jovemPorId } = await supabase
            .from("jovem_aprendiz")
            .select("*")
            .eq("id_ja", userId)
            .maybeSingle();

          jovem = jovemPorId || null;

          if (!jovem && emailAuth) {
            const { data: jovemPorEmail } = await supabase
              .from("jovem_aprendiz")
              .select("*")
              .eq("email", emailAuth)
              .maybeSingle();

            jovem = jovemPorEmail || null;
          }

          // Se não encontrou Jovem, verifica se o usuário é uma Empresa
          if (!jovem) {
            const { data: empresaData } = await supabase
              .from("empresa")
              .select("*")
              .or(`id_em.eq.${userId},email.eq.${emailAuth || ""}`)
              .maybeSingle();

            if (empresaData) {
              if (mounted) {
                setIsEmpresa(true);
                setIsJovem(false);
                setLoading(false);
              }
              return;
            }
          }

          // Se não encontrou nem Jovem nem Empresa e a rota permite Jovem tenta AUTOCRIAR um Jovem
          if (!jovem && emailAuth) {
            console.log(
              "Jovem não encontrado. Tentando criar automaticamente...",
            );
            const { data: novoJovem, error: insertError } = await supabase
              .from("jovem_aprendiz")
              .upsert(
                {
                  id_ja: userId,
                  email: emailAuth,
                  nome: nomeAuth,
                  email_confirmado: true,
                },
                { onConflict: "id_ja" },
              )
              .select()
              .single();

            if (insertError) {
              console.error("Erro ao criar jovem:", insertError);
            } else {
              jovem = novoJovem;
            }
          }

          if (jovem) {
            const { data: currData } = await supabase
              .from("curriculo_ja")
              .select("*")
              .eq("id_ja", jovem.id_ja || userId)
              .maybeSingle();

            const calcPercent = calcularPercentualPerfil(jovem, currData);
            const verificado =
              jovem.email_confirmado === true ||
              String(jovem.email_confirmado).toLowerCase() === "true";

            if (mounted) {
              setIsJovem(true);
              setIsEmpresa(false);
              setEmailConfirmado(verificado);
              setPercentPerfil(calcPercent);
              setLoading(false);
            }
            return;
          }
        }

        if (mounted) {
          setIsJovem(false);
          setIsEmpresa(false);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro ao validar identidade:", err);
        if (mounted) {
          setIsJovem(false);
          setIsEmpresa(false);
          setLoading(false);
        }
      }
    }

    checarIdentidade();

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // VERIFICAÇÃO DE PERMISSÃO DE ACESSO
  const temAcesso =
    (listaTipos.includes("jovem_aprendiz") && isJovem) ||
    (listaTipos.includes("empresa") && isEmpresa);

  // ROTAS RESTRITAS PARA JOVEM COM PERFIL INCOMPLETO (< 98%)
  const rotasRestritasJovem = ["/vagas", "/vagas-recomendadas", "/buscarUsers"];
  const acessandoRotaRestrita =
    isJovem &&
    rotasRestritasJovem.some(
      (rota) =>
        location.pathname === rota || location.pathname.startsWith(rota + "/"),
    );

  const perfilCompleto = percentPerfil !== null && percentPerfil >= 98;

  // TIMER PARA TELA DE AVISO (4 SEGUNDOS)
  useEffect(() => {
    if (
      !loading &&
      (!temAcesso || (acessandoRotaRestrita && !perfilCompleto))
    ) {
      setTimerConcluido(false);

      const timer = setTimeout(() => {
        setTimerConcluido(true);
      }, 4000);

      return () => clearTimeout(timer);
    }

    setTimerConcluido(false);
  }, [loading, temAcesso, acessandoRotaRestrita, perfilCompleto]);

  // TELA DE CARREGAMENTO
  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at top, #18052d 0%, #07010f 65%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Poppins', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "90%",
            maxWidth: 380,
            background:
              "linear-gradient(180deg, rgba(24,12,42,0.85) 0%, rgba(11,4,20,0.9) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 28,
            padding: "44px 32px",
            backdropFilter: "blur(24px)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 24px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "3px solid rgba(255,255,255,0.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "3px solid transparent",
                borderTopColor: "#a855f7",
                borderRightColor: "#9333ea",
                animation: "spin 0.85s linear infinite",
              }}
            />
          </div>

          <h2
            style={{
              margin: "auto",
              color: "white",
              fontSize: 20,
              textAlign: "center",
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            Autenticando aguarde
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: "#a8a3b7",
              fontSize: 14,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Sincronizando suas credenciais CIJA...
          </p>

          <div
            style={{
              marginTop: 28,
              height: 4,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "40%",
                background: "linear-gradient(90deg, #9333ea, #c084fc)",
                borderRadius: 99,
                animation: "load 4.0s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes load {
            0% { transform: translateX(-120%); }
            50% { transform: translateX(250%); }
            100% { transform: translateX(-120%); }
          }
        `}</style>
      </div>
    );
  }

  // USUÁRIO N AUTENTICADO
  if (!isJovem && !isEmpresa) {
    return listaTipos.includes("empresa") &&
      !listaTipos.includes("jovem_aprendiz") ? (
      <Navigate to="/loginEmpresa" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  // E-MAIL DO JOVEM NÃO CONFIRMADO
  if (isJovem && !emailConfirmado) {
    if (location.pathname !== "/confirmar-email") {
      return <Navigate to="/confirmar-email" replace />;
    }
    return <>{children}</>;
  }

  // PERFIL INCOMPLETO DO JOVEM APRENDIZ (< 98%)
  if (acessandoRotaRestrita && !perfilCompleto) {
    if (timerConcluido) {
      return (
        <Navigate
          to="/perfil"
          replace
          state={{
            erro: "Você precisa completar pelo menos 98% do seu perfil antes de acessar as vagas, vagas recomendadas ou busca de usuários.",
          }}
        />
      );
    }

    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07010f",
          fontFamily: "'Poppins', sans-serif",
          padding: 20,
        }}
      >
        <div
          style={{
            background: "rgba(24,12,42,0.9)",
            padding: 40,
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            textAlign: "center",
            maxWidth: 440,
            width: "100%",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "4px solid #f59e0b",
          }}
        >
          <h2
            style={{
              color: "white",
              margin: "0 0 10px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Perfil Incompleto ({percentPerfil ?? 0}%)
          </h2>

          <p
            style={{
              color: "#a8a3b7",
              margin: "0 0 24px",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Para acessar{" "}
            <strong style={{ color: "white" }}>{location.pathname}</strong>,
            você precisa completar pelo menos 98% do seu perfil. Complete suas
            informações antes de continuar!
          </p>

          <button
            onClick={() => {
              window.location.href = "/perfil";
            }}
            style={{
              background: "linear-gradient(135deg, #9333ea, #a855f7)",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              width: "100%",
              marginBottom: "16px",
            }}
          >
            Completar Perfil Agora
          </button>

          <div
            style={{
              color: "#71717a",
              fontSize: 13,
            }}
          >
            Redirecionando para o perfil em instantes...
          </div>
        </div>
      </div>
    );
  }

  // 5. TIPO DE USUÁRIO SEM PERMISSÃO
  if (!temAcesso) {
    if (timerConcluido) {
      return isEmpresa ? (
        <Navigate to="/dashboard-empresa" replace />
      ) : (
        <Navigate to="/perfil" replace />
      );
    }

    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07010f",
          fontFamily: "'Poppins', sans-serif",
          padding: 20,
        }}
      >
        <div
          style={{
            background: "rgba(24,12,42,0.9)",
            padding: 40,
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            textAlign: "center",
            maxWidth: 420,
            width: "100%",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "4px solid #ef4444",
          }}
        >
          <h2
            style={{
              color: "white",
              margin: "0 0 10px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Acesso Restrito
          </h2>

          <p
            style={{
              color: "#a8a3b7",
              margin: "0 0 24px",
              fontSize: 15,
            }}
          >
            Esta área é restrita para o seu tipo de conta.
          </p>

          <div
            style={{
              color: "#71717a",
              fontSize: 13,
            }}
          >
            Redirecionando em instantes...
          </div>
        </div>
      </div>
    );
  }

  // ACESSO AUTORIZADO
  return <>{children}</>;
}
