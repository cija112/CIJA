<p align="center">
  <img
    src="https://capsule-render.vercel.app/api?type=waving&color=0:160B2E,45:4B1F7A,75:7B3FC6,100:9B6DE3&height=230&section=header&text=CIJA&fontSize=72&fontColor=FFFFFF&fontAlignY=42&desc=Centro%20de%20Integra%C3%A7%C3%A3o%20Jovem%20Aprendiz&descSize=19&descAlignY=67&descColor=FFFFFF"
    width="100%"
  />
</p>

<p align="center">
  <strong>Plataforma web para conexão entre jovens aprendizes e empresas.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini">
  <img src="https://img.shields.io/badge/EmailJS-FF6C37?style=for-the-badge&logo=gmail&logoColor=white" alt="EmailJS">
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=000000" alt="Render">
</p>

---

## Sobre o CIJA

O **CIJA — Centro de Integração Jovem Aprendiz** é uma plataforma web desenvolvida para conectar **jovens em busca da primeira oportunidade profissional** a empresas que oferecem vagas destinadas ao programa de **Jovem Aprendiz**.

A plataforma centraliza diferentes etapas do processo seletivo em um único ambiente, permitindo que o candidato crie e revise seu currículo, encontre oportunidades e realize candidaturas, enquanto as empresas podem publicar vagas, analisar candidatos e gerenciar suas seleções.

O projeto também conta com uma ferramenta de **análise de currículos utilizando Inteligência Artificial**, permitindo que o candidato escolha entre uma revisão manual ou uma revisão assistida por IA.

O CIJA foi desenvolvido com foco em uma experiência moderna, responsiva e profissional, mantendo uma separação clara entre a área do candidato e a área empresarial.

---

## Objetivo

O principal objetivo do CIJA é facilitar a entrada de jovens no mercado de trabalho, oferecendo uma plataforma direcionada exclusivamente para **oportunidades de Jovem Aprendiz**.

A proposta é simplificar tanto a experiência do candidato quanto o processo de gerenciamento realizado pelas empresas.

### Para o candidato

* Criar e gerenciar seu perfil;
* Criar e editar seu currículo;
* Revisar o currículo manualmente;
* Utilizar Inteligência Artificial para análise do currículo;
* Encontrar vagas de Jovem Aprendiz;
* Candidatar-se às oportunidades;
* Acompanhar suas candidaturas;
* Conversar diretamente com empresas através do chat.

### Para a empresa

* Criar e gerenciar vagas;
* Receber candidaturas;
* Visualizar candidatos;
* Analisar currículos;
* Aprovar candidatos;
* Recusar candidatos;
* Gerenciar o processo seletivo;
* Conversar diretamente com candidatos.

---

## Fluxo da Plataforma

O CIJA foi estruturado para conectar as duas partes do processo seletivo.

```text
                         CIJA
                          │
             ┌────────────┴────────────┐
             │                         │
          Candidato                 Empresa
             │                         │
             │                         │
      Cria seu perfil            Cria uma vaga
             │                         │
      Cria o currículo                 │
             │                         │
       ┌─────┴─────┐                   │
       │           │                   │
    Manual         IA                  │
       │           │                   │
       └─────┬─────┘                   │
             │                         │
        Currículo                      │
             │                         │
             └──── Candidatura ────────┘
                          │
                          ▼
                 Empresa analisa
                          │
                 ┌────────┴────────┐
                 │                 │
              Aprova             Recusa
                 │
                 ▼
              Chat direto
```

---

## Currículo

O currículo é uma das principais funcionalidades do CIJA.

O candidato possui controle sobre suas informações profissionais e pode realizar alterações antes de se candidatar a uma oportunidade.

### Revisão manual

O candidato pode revisar e editar seu currículo diretamente pela plataforma, sem utilizar Inteligência Artificial.

Essa opção permite que o usuário tenha controle completo sobre o conteúdo apresentado às empresas.

### Revisão com Inteligência Artificial

O CIJA também oferece uma ferramenta de análise de currículo utilizando **Google Gemini**.

A IA é utilizada para analisar a estrutura e o conteúdo do currículo, buscando melhorar sua apresentação e compatibilidade com sistemas **ATS — Applicant Tracking Systems**.

A análise pode considerar:

* Estrutura do currículo;
* Clareza das informações;
* Organização do conteúdo;
* Compatibilidade com ATS;
* Pontos fortes;
* Pontos que podem ser melhorados;
* Sugestões de aprimoramento;
* Organização estratégica das informações.

A Inteligência Artificial atua como uma ferramenta de apoio e **não deve inventar experiências, cursos, habilidades ou informações profissionais que não tenham sido fornecidas pelo candidato**.

---

## Processo de Candidatura

Após preparar seu currículo, o candidato pode visualizar as vagas disponíveis e realizar uma candidatura.

Quando a candidatura é realizada, as informações necessárias do candidato são disponibilizadas para análise da empresa responsável pela vaga.

A empresa pode então:

**Aprovar**

O candidato pode avançar no processo seletivo e utilizar o sistema de comunicação para conversar com a empresa.

**Recusar**

A candidatura é recusada pela empresa dentro do processo seletivo.

Esse fluxo permite que o CIJA acompanhe a interação entre candidato e empresa desde a candidatura até a etapa de comunicação.

---

## Chat

O CIJA possui um sistema de comunicação direta entre **candidatos e empresas**.

O chat foi pensado para permitir que as partes mantenham a comunicação dentro da própria plataforma, evitando a necessidade de utilizar diferentes sistemas externos para acompanhar uma candidatura.

---

## Área Empresarial

A área empresarial funciona como um ambiente de gerenciamento das oportunidades e dos candidatos.

A empresa pode:

* Criar novas vagas;
* Definir informações da oportunidade;
* Gerenciar vagas existentes;
* Receber candidaturas;
* Visualizar currículos;
* Analisar candidatos;
* Aprovar candidatos;
* Recusar candidatos;
* Gerenciar o processo seletivo;
* Utilizar o chat com candidatos.

A estrutura foi desenvolvida para oferecer uma visão centralizada do processo de recrutamento de jovens aprendizes.

---

## Vagas

As oportunidades disponíveis na plataforma são direcionadas exclusivamente ao público de **Jovem Aprendiz**.

O candidato pode visualizar as informações das oportunidades e realizar sua candidatura através da própria plataforma.

A proposta é evitar que o jovem precise procurar oportunidades em diferentes sistemas e plataformas.

---

## Inteligência Artificial

A funcionalidade de Inteligência Artificial do CIJA utiliza a tecnologia **Google Gemini 3.5 flash** para auxiliar na análise e revisão de currículos.

### Tecnologia

* Google Gemini 3.5 flash
* Node.js
* TypeScript

A integração é realizada através do backend da aplicação, mantendo o processamento da IA separado da interface do usuário.

A IA foi incorporada ao sistema como uma ferramenta de apoio à preparação profissional do candidato, e não como substituta das informações fornecidas pelo usuário.

---

## Tecnologias

### Frontend

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router">
  <img src="https://img.shields.io/badge/CSS_Modules-000000?style=for-the-badge&logo=cssmodules&logoColor=white" alt="CSS Modules">
</p>

* React
* TypeScript
* Vite
* React Router DOM
* CSS Modules

### Backend

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
</p>

* Node.js
* Express.js
* TypeScript

### Banco de Dados e Autenticação

<p>
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
</p>

* Supabase
* Supabase Auth

### Inteligência Artificial

<p>
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini">
</p>

* Google Gemini 3.5 flash

### Comunicação

<p>
  <img src="https://img.shields.io/badge/EmailJS-FF6C37?style=for-the-badge&logo=gmail&logoColor=white" alt="EmailJS">
</p>

* EmailJS

O **EmailJS** é utilizado para funcionalidades relacionadas ao envio de e-mails pela plataforma, como comunicação e suporte ao usuário.

---

## Hospedagem e Deploy

O backend do CIJA é desenvolvido com **Node.js, Express.js e TypeScript** e está hospedado na plataforma **Render**.

<p align="center">
  <img src="https://img.shields.io/badge/Backend_Hosting-Render-46E3B7?style=for-the-badge&logo=render&logoColor=000000" alt="Render">
</p>

A utilização do Render permite manter a API do backend hospedada e disponível para comunicação com o frontend da aplicação.

O frontend e o backend são mantidos separados, permitindo uma organização mais clara entre a interface da aplicação e os serviços responsáveis pelo processamento das requisições.

---

## Arquitetura

A aplicação é dividida em diferentes camadas para manter as responsabilidades organizadas.

```text
┌─────────────────────────────────────────────────────┐
│                    CIJA PLATFORM                    │
└────────────────────────┬────────────────────────────┘
                         │
              ┌──────────▼──────────┐
              │       Frontend       │
              │ React + TypeScript  │
              │        + Vite       │
              └──────────┬──────────┘
                         │
                         │ HTTP / API
                         │
              ┌──────────▼──────────┐
              │       Backend       │
              │ Node.js + Express   │
              │     + TypeScript    │
              └──────┬───────┬──────┘
                     │       │
             ┌───────▼───┐   │
             │ Supabase  │   │
             │ Auth / DB │   │
             └───────────┘   │
                             │
                      ┌──────▼──────┐
                      │    Gemini   │
                      │     IA      │
                      └─────────────┘
```

---

## Autenticação e Segurança

O CIJA utiliza mecanismos de autenticação e controle de acesso para separar as diferentes áreas da plataforma.

Entre os recursos implementados estão:

* Autenticação através do Supabase;
* Controle de sessão;
* Proteção de rotas;
* Separação entre candidatos e empresas;
* Validação de dados;
* Validações no frontend e backend;
* Controle de acesso às funcionalidades;
* Processamento estruturado das informações.

---

## Interface

A interface do CIJA foi desenvolvida com foco em uma experiência moderna e profissional.

Principais características:

* Design responsivo;
* Componentização;
* CSS Modules;
* Animações e transições;
* Feedback visual;
* Validação de formulários;
* Máscaras de entrada;
* Separação visual entre áreas;
* Interface adaptada para diferentes resoluções.

---

## Responsividade

A aplicação foi desenvolvida para diferentes dispositivos:

* Smartphones;
* Tablets;
* Notebooks;
* Desktops.

O layout adapta seus componentes e elementos de navegação de acordo com o tamanho da tela.

---

## Funcionalidades

| Funcionalidade             | Jovem | Empresa |
| :------------------------- | :---: | :-----: |
| Cadastro                   |   ✓   |    ✓    |
| Login                      |   ✓   |    ✓    |
| Recuperação de senha       |   ✓   |    ✓    |
| Perfil                     |   ✓   |    ✓    |
| Criação de currículo       |   ✓   |    —    |
| Revisão manual             |   ✓   |    —    |
| Revisão com IA             |   ✓   |    —    |
| Visualização de vagas      |   ✓   |    —    |
| Candidatura                |   ✓   |    —    |
| Criação de vagas           |   —   |    ✓    |
| Gerenciamento de vagas     |   —   |    ✓    |
| Visualização de candidatos |   —   |    ✓    |
| Análise de currículos      |   —   |    ✓    |
| Aprovação de candidatos    |   —   |    ✓    |
| Recusa de candidatos       |   —   |    ✓    |
| Chat                       |   ✓   |    ✓    |

---

## Execução do Projeto

### Pré-requisitos

Antes de executar o projeto, certifique-se de possuir:

* Node.js;
* npm;
* Uma conta/projeto configurado no Supabase;
* Variáveis de ambiente necessárias;
* Acesso à API utilizada pelo Google Gemini.

### Instalação

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre no diretório:

```bash
cd Projeto-CIJA-
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente necessárias para o frontend e backend.

Exemplo de configuração do frontend:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_do_supabase
```

As variáveis relacionadas ao backend e ao Google Gemini devem ser configuradas de acordo com o ambiente utilizado para execução da API.

---

## Estrutura do Projeto

Uma representação simplificada da organização:

```text
CIJA/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   │
│   └── package.json
│
├── README.md
└── ...
```

---

## Projeto Acadêmico

O CIJA foi desenvolvido como projeto acadêmico com o objetivo de aplicar conhecimentos de:

* Desenvolvimento Web;
* Engenharia de Software;
* Desenvolvimento Frontend;
* Desenvolvimento Backend;
* APIs;
* Banco de Dados;
* Autenticação;
* Inteligência Artificial;
* Experiência do Usuário;
* Arquitetura de Sistemas.

A aplicação foi projetada buscando representar uma solução funcional para um problema real: a dificuldade de conexão entre jovens em busca da primeira oportunidade profissional e empresas que procuram novos aprendizes.

---

# Termos de Uso e Compartilhamento

**Autores:** Thiago Abraão, Cauã Galvão Franzin, Charles Eduardo, Gabriel De Camargo, Murilo Pereira.
**Orientador(a):** Matheus Amendola Redivo.
**Projeto:** CIJA — Centro de Integração Jovem Aprendiz, TCC Informática, Colégio Técnico Bento Quirino, 3 ANO-A.

© [Ano] Thiago Abraão, Cauã Galvão Franzin, Charles Eduardo, Gabriel De Camargo, Murilo Pereira. **Todos os direitos reservados**, exceto o que está expressamente permitido abaixo.

Este projeto **não possui licença open source**. O código-fonte permanece protegido pelos direitos de seus respectivos autores.

## Permitido

* Consultar e estudar o código para fins educacionais.
* Uso para avaliação do TCC e apresentação acadêmica.
* Uso não comercial por terceiros, desde que respeitadas as condições de crédito abaixo.

## Condições

**1. Crédito obrigatório:** qualquer uso, cópia, adaptação ou divulgação deve citar os autores pelo nome e incluir link para este repositório.

**2. Sem fins lucrativos:** é proibido usar, vender, licenciar ou oferecer este código ou seus derivados como produto ou serviço comercial sem autorização e contratação prévia dos autores.

**3. Uso institucional:** o uso pela instituição de ensino além da avaliação do TCC, incluindo outros projetos, sistemas internos ou divulgação, depende de autorização prévia e por escrito dos autores.

**4. Derivados:** trabalhos derivados devem manter este aviso e indicar claramente quais partes foram alteradas.

## Contato

Para solicitar autorização ou contratar os autores:

* **E-mail:** [thiagocontaazr123@gmail.com](mailto:thiagocontaazr123@gmail.com)
* **LinkedIn:** [https://www.linkedin.com/in/thiagoarauj01/]
* **GitHub:** [https://github.com/thiagobentoquirido]
* **Contatos dos demais autores:** :
[charlesedoliveira@gmail.com](mailto:charlesedoliveira@gmail.com)
[cauagalvao07@gmail.com](mailto:cauagalvao07@gmail.com)
[tyltedy@gmail.com](mailto:tyltedy@gmail.com)
[gabriel.de.camargo08@gmail.com](gabriel.de.camargo08@gmail.com)

## Isenção de Garantia

O software é fornecido **"como está"**, sem garantias de qualquer tipo, expressas ou implícitas. Os autores não se responsabilizam por danos ou prejuízos decorrentes do uso, modificação ou distribuição não autorizada do projeto.

---

<p align="center">
  <strong>CIJA — Centro de Integração Jovem Aprendiz</strong><br>
  Projeto acadêmico desenvolvido por Thiago Abraão, Cauã Galvão Franzin, Charles Eduardo, Gabriel De Camargo e Murilo Pereira.
</p>

<p align="center">
  <img
    src="https://capsule-render.vercel.app/api?type=waving&color=0:160B2E,45:4B1F7A,75:7B3FC6,100:9B6DE3&height=120&section=footer"
    width="100%"
  />
</p>
