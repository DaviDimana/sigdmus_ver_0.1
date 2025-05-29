
import jsPDF from 'jspdf';
import { getFieldLabels } from './formFields';

interface GenerateLabelsParams {
  type: 'partituras' | 'performances';
  fields: string[];
}

// Dados mock atualizados (mesmos do reportGenerator)
const mockPartituras = [
  {
    id: 1,
    setor: "Acervo OSUFBA",
    titulo: "Sinfonia nº 9 em Ré menor",
    compositor: "Ludwig van Beethoven",
    instrumentacao: "Orquestra Sinfônica",
    tonalidade: "Ré menor",
    genero: "Sinfonia",
    edicao: "Primeira edição",
    anoEdicao: "1824",
    digitalizado: "sim",
    numeroArmario: "A01",
    numeroPrateleira: "P01",
    numeroPasta: "PA001"
  },
  {
    id: 2,
    setor: "Acervo Schuwebel",
    titulo: "Ave Maria",
    compositor: "Franz Schubert",
    instrumentacao: "Voz e Piano",
    tonalidade: "Si bemol maior",
    genero: "Lied",
    edicao: "Segunda edição",
    anoEdicao: "1825",
    digitalizado: "sim",
    numeroArmario: "A02",
    numeroPrateleira: "P02",
    numeroPasta: "PA002"
  },
  {
    id: 3,
    setor: "Compositores da Bahia",
    titulo: "O Guarani - Abertura",
    compositor: "Carlos Gomes",
    instrumentacao: "Orquestra",
    tonalidade: "Lá maior",
    genero: "Abertura",
    edicao: "Primeira edição",
    anoEdicao: "1870",
    digitalizado: "nao",
    numeroArmario: "A03",
    numeroPrateleira: "P03",
    numeroPasta: "PA003"
  }
];

const mockPerformances = [
  {
    id: 1,
    tituloObra: "Sinfonia nº 9 em Ré menor",
    nomeCompositor: "Ludwig van Beethoven",
    local: "Sala Principal",
    data: "2024-12-25",
    horario: "19:30",
    maestros: "Maestro Silva",
    interpretes: "Orquestra Sinfônica da UFBA",
    release: "Concerto especial de Natal com a obra mais famosa de Beethoven"
  },
  {
    id: 2,
    tituloObra: "Ave Maria",
    nomeCompositor: "Franz Schubert",
    local: "Auditório",
    data: "2025-01-02",
    horario: "20:00",
    maestros: "Ana Costa",
    interpretes: "Maria Santos (Soprano), João Silva (Piano)",
    release: "Recital intimista de música sacra"
  },
  {
    id: 3,
    tituloObra: "O Guarani - Abertura",
    nomeCompositor: "Carlos Gomes",
    local: "Teatro Municipal",
    data: "2024-11-15",
    horario: "18:00",
    maestros: "Maestro Santos",
    interpretes: "Orquestra Sinfônica da Bahia",
    release: "Festival de música brasileira com obras de compositores nacionais"
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
