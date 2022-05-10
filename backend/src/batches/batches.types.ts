type PdfFileProperties = {
  numpages: number;
  numrender: number;
  info: {
    PDFFormatVersion: string;
    IsAcroFormPresent: boolean;
    IsXFAPresent: boolean;
    Producer: string;
    ModDate: string;
  };
  metadata: any;
  text: string;
  version: string;
};
type ParserParameter = {
  field: string;
  regexMethod: boolean;
  firstIndex: string | null; // regexp tb?
  secondIndex: RegExp;
  formatFn?: (i: string) => Promise<string>;
};
type Parser = ParserParameter[];

type PdfParser = {
  name: string;
  description?: string;
  // fields: Array<string>;
  parameters: ParserParameter[];
};
type PdfParserOutput = {
  date: string;
  amount: string;
  name: string;
  cpfCnpj: string;
};

interface IReadFiles {
  files: Array<Express.Multer.File>;
  parser: string;
  raw?: boolean;
}
