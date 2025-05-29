
import jsPDF from 'jspdf';

interface GenerateLabelsParams {
  type: 'partituras' | 'performances';
  fields: string[];
}

// Dados mock (mesmos do reportGenerator)
const mockPartituras = [
  {
    id: 1,
    titulo: "Sinfonia nº 9 em Ré menor",
    compositor: "Ludwig van Beethoven",
    genero: "Clássico",
    duracao: "65 min",
    dificuldade: "Avançado",
    status: "Ativo",
    dataAdicao: "2024-01-15",
    ultimaPerformance: "2024-03-20"
  },
  {
    id: 2,
    titulo: "Ave Maria",
    compositor: "Franz Schubert",
    genero: "Sacro",
    duracao: "6 min",
    dificuldade: "Intermediário",
    status: "Ativo",
    dataAdicao: "2024-02-10",
    ultimaPerformance: "2024-05-12"
  },
  {
    id: 3,
    titulo: "O Guarani - Abertura",
    compositor: "Carlos Gomes",
    genero: "Ópera",
    duracao: "8 min",
    dificuldade: "Avançado",
    status: "Ativo",
    dataAdicao: "2024-01-28",
    ultimaPerformance: "2024-04-08"
  }
];

const mockPerformances = [
  {
    id: 1,
    titulo: "Concerto de Natal",
    obra: "Sinfonia nº 9 - Beethoven",
    data: "2024-12-25",
    horario: "19:30",
    local: "Sala Principal",
    regente: "Maestro Silva",
    publico: 250,
    status: "Agendado",
    tipo: "Concerto"
  },
  {
    id: 2,
    titulo: "Recital de Piano",
    obra: "Ave Maria - Schubert",
    data: "2025-01-02",
    horario: "20:00",
    local: "Auditório",
    regente: "Ana Costa",
    publico: 120,
    status: "Agendado",
    tipo: "Recital"
  },
  {
    id: 3,
    titulo: "Festival de Inverno",
    obra: "O Guarani - Carlos Gomes",
    data: "2024-11-15",
    horario: "18:00",
    local: "Teatro Municipal",
    regente: "Maestro Santos",
    publico: 400,
    status: "Realizado",
    tipo: "Festival"
  }
];

export const generateLabels = ({ type, fields }: GenerateLabelsParams) => {
  const data = type === 'partituras' ? mockPartituras : mockPerformances;
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Configurações da etiqueta (compatível com Pimaco)
  const labelWidth = 50;
  const labelHeight = 25;
  const marginLeft = 10;
  const marginTop = 15;
  const spacingX = 15;
  const spacingY = 5;
  const labelsPerRow = 3;
  const labelsPerColumn = 10;
  
  let currentLabel = 0;
  let pageNumber = 1;
  
  data.forEach((item, index) => {
    if (currentLabel >= labelsPerRow * labelsPerColumn) {
      doc.addPage();
      currentLabel = 0;
      pageNumber++;
    }
    
    const row = Math.floor(currentLabel / labelsPerRow);
    const col = currentLabel % labelsPerRow;
    
    const x = marginLeft + col * (labelWidth + spacingX);
    const y = marginTop + row * (labelHeight + spacingY);
    
    // Desenhar borda da etiqueta
    doc.setLineWidth(0.1);
    doc.rect(x, y, labelWidth, labelHeight);
    
    // Adicionar conteúdo da etiqueta
    let lineY = y + 4;
    const lineHeight = 3;
    doc.setFontSize(8);
    
    fields.forEach((field, fieldIndex) => {
      if (lineY + lineHeight > y + labelHeight - 2) return; // Não ultrapassar a etiqueta
      
      const value = item[field as keyof typeof item];
      const text = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
      
      // Truncar texto se for muito longo
      const maxWidth = labelWidth - 4;
      const truncatedText = doc.getTextWidth(text) > maxWidth 
        ? text.substring(0, Math.floor(text.length * maxWidth / doc.getTextWidth(text))) + '...'
        : text;
      
      doc.text(truncatedText, x + 2, lineY);
      lineY += lineHeight;
    });
    
    currentLabel++;
  });
  
  doc.save(`etiquetas_${type}_${new Date().toISOString().slice(0, 10)}.pdf`);
};
