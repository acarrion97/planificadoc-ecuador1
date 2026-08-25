// `word-extractor` no publica tipos propios — declaración ambiente mínima
// con la superficie que este módulo usa (ver parse-doc.ts).
declare module "word-extractor" {
  class Document {
    getBody(options?: unknown): string;
  }

  export default class WordExtractor {
    extract(source: string | Buffer): Promise<Document>;
  }
}
