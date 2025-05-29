import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { getFieldLabels } from './formFields';

// Dados mock atualizados com os campos dos formulários
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

interface GenerateReportParams {
  type: 'partituras' | 'performances';
  fields: string[];
  format: 'pdf' | 'word' | 'excel';
}

export const generateReport = ({ type, fields, format }: GenerateReportParams) => {
  const data = type === 'partituras' ? mockPartituras : mockPerformances;
  const fieldLabels = getFieldLabels(type);
  
  const headers = fields.map(field => fieldLabels[field] || field);
  const rows = data.map(item => 
    fields.map(field => {
      const value = item[field as keyof typeof item];
      return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
    })
  );

  switch (format) {
    case 'pdf':
      generatePDFReport(headers, rows, type);
      break;
    case 'word':
      generateWordReport(headers, rows, type);
      break;
    case 'excel':
      generateExcelReport(headers, rows, type);
      break;
  }
};

const generatePDFReport = (headers: string[], rows: string[][], type: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text(`Relatório de ${type === 'partituras' ? 'Partituras' : 'Performances'}`, 20, 20);
  
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);

  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    margin: { top: 40 }
  });

  doc.save(`relatorio_${type}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

const generateWordReport = async (headers: string[], rows: string[][], type: string) => {
  const tableRows = [
    new TableRow({
      children: headers.map(header => 
        new TableCell({
          children: [new Paragraph(header)],
          width: { size: 100 / headers.length, type: WidthType.PERCENTAGE }
        })
      )
    }),
    ...rows.map(row => 
      new TableRow({
        children: row.map(cell => 
          new TableCell({
            children: [new Paragraph(cell)],
            width: { size: 100 / headers.length, type: WidthType.PERCENTAGE }
          })
        )
      })
    )
  ];

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: `Relatório de ${type === 'partituras' ? 'Partituras' : 'Performances'}`,
          heading: 'Heading1'
        }),
        new Paragraph({
          text: `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`,
        }),
        new Paragraph(''),
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE }
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  saveAs(new Blob([buffer]), `relatorio_${type}_${new Date().toISOString().slice(0, 10)}.docx`);
};

const generateExcelReport = (headers: string[], rows: string[][], type: string) => {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(wb, ws, type === 'partituras' ? 'Partituras' : 'Performances');
  
  XLSX.writeFile(wb, `relatorio_${type}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
