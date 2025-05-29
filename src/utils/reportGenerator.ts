
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from 'docx';
import { saveAs } from 'file-saver';

// Dados mock para demonstração
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

interface GenerateReportParams {
  type: 'partituras' | 'performances';
  fields: string[];
  format: 'pdf' | 'word' | 'excel';
}

const getFieldLabels = (type: 'partituras' | 'performances') => {
  if (type === 'partituras') {
    return {
      titulo: 'Título da Obra',
      compositor: 'Nome do Compositor',
      genero: 'Gênero',
      duracao: 'Duração',
      dificuldade: 'Dificuldade',
      status: 'Status',
      dataAdicao: 'Data de Adição',
      ultimaPerformance: 'Última Performance'
    };
  } else {
    return {
      titulo: 'Título',
      obra: 'Obra',
      data: 'Data',
      horario: 'Horário',
      local: 'Local',
      regente: 'Regente',
      publico: 'Público',
      status: 'Status',
      tipo: 'Tipo'
    };
  }
};

export const generateReport = ({ type, fields, format }: GenerateReportParams) => {
  const data = type === 'partituras' ? mockPartituras : mockPerformances;
  const fieldLabels = getFieldLabels(type);
  
  const headers = fields.map(field => fieldLabels[field as keyof typeof fieldLabels]);
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
