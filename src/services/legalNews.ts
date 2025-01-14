interface LegalNotice {
  title: string;
  date: string;
  content: string;
  url: string;
}

// Helper function to get December 2024 notices
function getDecemberNotices(): LegalNotice[] {
  return [
    {
      title: "Recesso Forense 2024/2025",
      date: "20/12/2024",
      content: "O Tribunal de Justiça de Pernambuco informa que o recesso forense ocorrerá entre os dias 20 de dezembro de 2024 e 6 de janeiro de 2025. Durante este período, funcionará apenas o regime de plantão judiciário.",
      url: "https://portal.tjpe.jus.br/web/portal/comunicacao/agencia-de-noticias/avisos"
    },
    {
      title: "Suspensão dos Prazos Processuais",
      date: "19/12/2024",
      content: "Comunicamos a suspensão dos prazos processuais no período de 20 de dezembro de 2024 a 20 de janeiro de 2025, conforme Resolução nº 471/2024 do TJPE.",
      url: "https://portal.tjpe.jus.br/web/portal/comunicacao/agencia-de-noticias/avisos"
    },
    {
      title: "Plantão Judiciário - Dezembro/2024",
      date: "01/12/2024",
      content: "Divulgada a escala do Plantão Judiciário do 1º e 2º Graus para o mês de dezembro de 2024. A escala completa está disponível no Portal do TJPE.",
      url: "https://portal.tjpe.jus.br/web/portal/comunicacao/agencia-de-noticias/avisos"
    }
  ];
}

export async function fetchLegalNews(): Promise<LegalNotice[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return only December 2024 notices
  return getDecemberNotices();
}