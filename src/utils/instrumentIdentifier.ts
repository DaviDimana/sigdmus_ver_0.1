// Dicionário de instrumentos e suas variações/abreviações
const instrumentDictionary: { [key: string]: string[] } = {
  'Flauta': ['flauta', 'flt', 'fl.', 'flute'],
  'Flautim': ['flautim', 'piccolo', 'picc', 'flautim', 'fl. piccolo', 'fl piccolo'],
  'Oboé': ['oboe', 'ob.', 'oboe', 'oboe d\'amore'],
  'Clarinete': ['clarinete', 'clarone', 'cl.', 'clarinet', 'clarineta', 'clarineta', 'clarinet in a', 'clarinet in b', 'clarinetto'],
  'Fagote': ['fagote', 'fg.', 'bassoon', 'basson'],
  'Trompa': ['trompa', 'hrn', 'horn', 'corno'],
  'Trompete': ['trompete', 'trp', 'trumpet', 'tpt'],
  'Trombone': ['trombone', 'trb', 'tbn'],
  'Tuba': ['tuba'],
  'Tímpanos': ['timpanos', 'timp', 'timpani', 'timpano'],
  'Percussão': [
    'percussao', 'perc', 'percussion',
    'triangle', 'triangulo', 'triângulo',
    'cymbals', 'pratos',
    'bass drum', 'bumbo',
    'snare drum', 'caixa',
    'tambourine', 'pandeiro',
    'glockenspiel', 'xilofone', 'xylophone',
    'castanets', 'castanholas',
    'wood block', 'bloco de madeira',
    'maracas', 'maraca',
    'bells', 'sinos',
    'tam-tam', 'gong',
    'chimes', 'tubular bells',
    'crotales', 'cowbell', 'agogô',
    'cymbal', 'suspended cymbal', 'prato suspenso',
    'drum', 'drums', 'drum set', 'bateria',
  ],
  'Piano': ['piano', 'pn'],
  'Harpa': ['harpa', 'harp'],
  'Violino 1': ['violino 1', 'violino i', 'vln1', 'vlni', 'violin i', 'violin 1'],
  'Violino 2': ['violino 2', 'violino ii', 'vln2', 'vlnii', 'violin ii', 'violin 2'],
  'Violino': ['violino', 'violin', 'vln'],
  'Viola': ['viola', 'vla'],
  'Violoncelo': ['violoncelo', 'vlc', 'cello', 'violoncello'],
  'Contrabaixo': ['contrabaixo', 'baixo', 'bass', 'cb', 'db', 'contrabass', 'contrabasso'],
  'Grade': ['grade', 'score', 'partitura completa', 'partitura', 'maestro'],
};

/**
 * Identifica o nome do instrumento a partir do nome de um arquivo.
 * @param filename O nome do arquivo a ser analisado.
 * @returns O nome padrão do instrumento ou null se não for encontrado.
 */
export function identifyInstrument(filename: string): string | null {
  const normalizedFilename = filename
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\.[^/.]+$/, ''); // Remove a extensão do arquivo

  // Priorizar correspondências mais longas e específicas primeiro (ex: "Violino 1" antes de "Violino")
  const sortedKeys = Object.keys(instrumentDictionary).sort((a, b) => b.length - a.length);

  for (const standardName of sortedKeys) {
    for (const variation of instrumentDictionary[standardName]) {
      // Usar \b para garantir que estamos combinando palavras inteiras quando possível
      const regex = new RegExp(`\\b${variation.replace(/([.*+?^=!:${}()|[\]\\\/])/g, '\\$1')}\\b`);
      if (regex.test(normalizedFilename)) {
        return standardName;
      }
    }
  }

  return null;
} 