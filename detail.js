"use strict";

const detailHeader = document.querySelector("#site-header");
const detailMenuButton = document.querySelector(".menu-toggle");
const detailNavigation = document.querySelector("#main-nav");

function setDetailMenu(open) {
  if (!detailNavigation || !detailMenuButton) return;
  detailNavigation.classList.toggle("open", open);
  detailMenuButton.setAttribute("aria-expanded", String(open));
  detailMenuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", open);
}

detailMenuButton?.addEventListener("click", () => {
  setDetailMenu(!detailNavigation.classList.contains("open"));
});

detailNavigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setDetailMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setDetailMenu(false);
});

window.addEventListener("scroll", () => {
  detailHeader?.classList.toggle("scrolled", window.scrollY > 24);

  const progress = document.querySelector(".reading-progress");
  if (progress) {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = available > 0 ? (window.scrollY / available) * 100 : 0;
    progress.style.width = `${Math.min(percentage, 100)}%`;
  }
}, { passive: true });

const detailRevealItems = document.querySelectorAll(".reveal");
const detailRevealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const delay = entry.target.dataset.delay || 0;
    entry.target.style.setProperty("--delay", `${delay}ms`);
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, { threshold: .1, rootMargin: "0px 0px -35px" });

detailRevealItems.forEach((item) => detailRevealObserver.observe(item));

document.querySelectorAll("[data-current-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const projects = {
  "escola-do-futuro": {
    category: "Educação",
    title: "Escola do Futuro",
    summary: "Modernização do ensino público com tecnologia, infraestrutura acessível e formação contínua para quem educa.",
    status: "Em tramitação",
    reach: "38 escolas",
    investment: "R$ 12 mi",
    people: "18 mil alunos",
    image: "imagens do deputado/IMG_0708.JPG.jpeg",
    imageAlt: "Professora orientando estudantes em uma sala de aula moderna",
    objective: "Criar ambientes de aprendizagem mais modernos, inclusivos e conectados com as competências do futuro.",
    lead: "Educação de qualidade exige estrutura, valorização profissional e acesso responsável às novas tecnologias.",
    paragraphs: [
      "O projeto Escola do Futuro reúne um conjunto de medidas para apoiar a modernização gradual da rede pública. A proposta estabelece critérios transparentes para investimentos em conectividade, laboratórios, bibliotecas e recursos de acessibilidade.",
      "A iniciativa também reconhece que nenhuma tecnologia substitui o papel do educador. Por isso, prevê ciclos permanentes de formação, apoio pedagógico e compartilhamento de boas práticas entre as unidades de ensino.",
      "A implementação será acompanhada por indicadores públicos de aprendizagem, permanência escolar e inclusão digital, permitindo que famílias e comunidades acompanhem cada etapa."
    ],
    points: ["Internet de alta velocidade nas escolas", "Formação contínua para educadores", "Tecnologia assistiva e acessibilidade", "Indicadores públicos de acompanhamento"]
  },
  "saude-mais-perto": {
    category: "Saúde",
    title: "Saúde Mais Perto",
    summary: "Atendimento itinerante, prevenção e fortalecimento da atenção básica para comunidades mais distantes.",
    status: "Projeto piloto",
    reach: "14 municípios",
    investment: "R$ 8 mi",
    people: "30 mil atendimentos",
    image: "imagens do deputado/IMG_9379.JPG.jpeg",
    imageAlt: "Equipe de saúde móvel atendendo moradores de uma comunidade",
    objective: "Reduzir distâncias e garantir que o cuidado básico chegue com regularidade a quem mais precisa.",
    lead: "Cuidar da saúde também significa enfrentar as barreiras geográficas que afastam milhares de pessoas do atendimento.",
    paragraphs: [
      "O Saúde Mais Perto propõe unidades móveis integradas à rede municipal, com agenda regular de consultas, exames básicos e ações de prevenção. O atendimento será organizado em parceria com equipes locais.",
      "Além dos serviços presenciais, o programa prevê apoio por telemedicina e encaminhamento responsável para tratamentos especializados, evitando deslocamentos desnecessários.",
      "Todos os resultados serão acompanhados por metas de cobertura, tempo de espera e continuidade do cuidado, com transparência para a população."
    ],
    points: ["Unidades móveis com agenda regular", "Telemedicina e triagem integrada", "Ações preventivas nas comunidades", "Encaminhamento para a rede especializada"]
  },
  "trabalho-que-avanca": {
    category: "Emprego",
    title: "Trabalho que Avança",
    summary: "Qualificação profissional, primeiro emprego e apoio prático para pequenos negócios e empreendedores locais.",
    status: "Em construção",
    reach: "5 mil vagas",
    investment: "R$ 6 mi",
    people: "120 parceiros",
    image: "imagens do deputado/IMG_6772.JPG.jpeg",
    imageAlt: "Participantes de uma oficina de qualificação profissional e empreendedorismo",
    objective: "Conectar formação, oportunidades e desenvolvimento local em uma mesma política pública.",
    lead: "Oportunidade de trabalho nasce quando qualificação, setor produtivo e apoio ao empreendedor caminham juntos.",
    paragraphs: [
      "O Trabalho que Avança cria trilhas de formação alinhadas às necessidades reais de cada região. Jovens e trabalhadores terão acesso a cursos curtos, orientação profissional e encaminhamento para vagas.",
      "Para quem empreende, a proposta reúne suporte técnico, educação financeira e caminhos simplificados para acessar microcrédito e compras públicas.",
      "Empresas participantes poderão colaborar com a construção dos conteúdos e oferecer experiências supervisionadas, sempre com critérios públicos e respeito à legislação."
    ],
    points: ["Trilhas rápidas de qualificação", "Programa de primeiro emprego", "Apoio ao pequeno empreendedor", "Parcerias com o setor produtivo"]
  }
};

const newsItems = {
  "escuta-cidada": {
    category: "Agenda",
    date: "24 de junho de 2026",
    title: "Comunidades participam de nova rodada de escuta cidadã",
    summary: "Encontros reuniram moradores, lideranças e representantes de serviços públicos para definir prioridades regionais.",
    image: "imagens do deputado/IMG_0716.JPG.jpeg",
    imageAlt: "Moradores participando de uma reunião comunitária de escuta cidadã",
    lead: "Ouvir antes de propor: esse foi o ponto de partida da nova rodada de encontros comunitários realizada ao longo da semana.",
    paragraphs: [
      "A agenda percorreu diferentes bairros e reuniu sugestões sobre mobilidade, saúde, educação e geração de oportunidades. Cada contribuição foi registrada por tema e território.",
      "As demandas serão organizadas em um relatório público, que servirá de base para novas propostas e para o acompanhamento de ações já iniciadas.",
      "A equipe do mandato manterá canais abertos para quem não pôde participar presencialmente, ampliando o processo de construção coletiva."
    ],
    quote: "A boa política começa quando a população encontra espaço verdadeiro para falar e participar das decisões."
  },
  "unidades-moveis-saude": {
    category: "Saúde",
    date: "18 de junho de 2026",
    title: "Unidades móveis de saúde chegam a novos municípios",
    summary: "Expansão do atendimento itinerante leva consultas e ações preventivas a comunidades mais distantes.",
    image: "imagens do deputado/IMG_9379.JPG.jpeg",
    imageAlt: "Profissionais de uma unidade móvel realizando atendimento de saúde comunitário",
    lead: "Novas rotas de atendimento móvel começaram a operar para aproximar os serviços básicos de saúde da população.",
    paragraphs: [
      "As unidades contam com equipes multiprofissionais e agenda definida em parceria com as administrações locais. A prioridade inicial são comunidades com maior dificuldade de deslocamento.",
      "Além de consultas, a programação inclui vacinação, orientação preventiva e encaminhamentos para a rede de referência.",
      "Os primeiros resultados serão avaliados por cobertura, tempo de espera e continuidade do cuidado, permitindo aprimorar as próximas etapas."
    ],
    quote: "Levar o cuidado até as pessoas é uma maneira concreta de reduzir desigualdades e proteger vidas."
  },
  "capacitacao-jovens": {
    category: "Juventude",
    date: "10 de junho de 2026",
    title: "Programa abre novas vagas de capacitação para jovens",
    summary: "Formação gratuita conecta competências digitais, orientação profissional e oportunidades de primeiro emprego.",
    image: "imagens do deputado/IMG_8960.JPG.jpeg",
    imageAlt: "Jovens adultos participando de uma capacitação em competências digitais",
    lead: "Uma nova etapa do programa de capacitação juvenil disponibilizará vagas gratuitas em áreas com demanda crescente.",
    paragraphs: [
      "Os cursos combinam conteúdos técnicos, competências digitais e preparação para processos seletivos. A seleção prioriza jovens em situação de vulnerabilidade.",
      "Empresas e instituições de ensino participam da construção das trilhas, aproximando os conteúdos da realidade do mercado de trabalho.",
      "Ao final, os participantes terão acesso a uma rede de orientação e encaminhamento para oportunidades de estágio, aprendizagem e primeiro emprego."
    ],
    quote: "Quando a juventude encontra formação e oportunidade, toda a comunidade avança junto."
  }
};

function setContent(name, value) {
  document.querySelectorAll(`[data-content="${name}"]`).forEach((element) => {
    element.textContent = value;
  });
}

function renderProject() {
  const root = document.querySelector("[data-project-page]");
  if (!root) return;

  const key = new URLSearchParams(window.location.search).get("projeto") || "escola-do-futuro";
  const project = projects[key] || projects["escola-do-futuro"];

  Object.entries(project).forEach(([name, value]) => {
    if (typeof value === "string") setContent(name, value);
  });

  document.querySelectorAll("[data-project-point]").forEach((item, index) => {
    item.textContent = project.points[index] || "";
  });

  document.querySelectorAll("[data-project-paragraph]").forEach((item, index) => {
    item.textContent = project.paragraphs[index] || "";
  });

  const projectImage = document.querySelector("[data-project-image]");
  if (projectImage) {
    projectImage.src = project.image;
    projectImage.alt = project.imageAlt;
  }

  document.title = `${project.title} | Felipe Souza`;
}

function renderNewsArticle() {
  const root = document.querySelector("[data-news-page]");
  if (!root) return;

  const key = new URLSearchParams(window.location.search).get("noticia") || "escuta-cidada";
  const article = newsItems[key] || newsItems["escuta-cidada"];

  Object.entries(article).forEach(([name, value]) => {
    if (typeof value === "string") setContent(name, value);
  });

  document.querySelectorAll("[data-news-paragraph]").forEach((item, index) => {
    item.textContent = article.paragraphs[index] || "";
  });

  const newsImage = document.querySelector("[data-news-image]");
  if (newsImage) {
    newsImage.src = article.image;
    newsImage.alt = article.imageAlt;
  }

  document.title = `${article.title} | Felipe Souza`;
}

renderProject();
renderNewsArticle();

const filterButtons = document.querySelectorAll("[data-filter]");
const archiveCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    archiveCards.forEach((card) => {
      card.hidden = filter !== "todas" && card.dataset.category !== filter;
    });
  });
});

const copyButton = document.querySelector("[data-copy-link]");
const toast = document.querySelector(".toast");

copyButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast?.classList.add("show");
    window.setTimeout(() => toast?.classList.remove("show"), 2200);
  } catch {
    copyButton.textContent = "Copie o endereço do navegador";
  }
});
