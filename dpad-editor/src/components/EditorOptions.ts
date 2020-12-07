export interface EditorOptions {
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  lineNumbers: "on" | "off" | "relative" | "interval";
}

export const langSuffix = new Map([
  ["cpp", "cpp"],
  ["html", "html"],
  ["java", "java"],
  ["javascript", "js"],
  ["markdown", "md"],
  ["sql", "sql"],
  ["python", "py"],
  ["shell", "sh"],
  ["typescript", "ts"]
]);

export const supportedLanguages: string[] = ["cpp", "html", "java", "javascript", "markdown", "sql", "python", "shell", "typescript"]

export const fontWeightOpts: string[] = ["normal", "bold"]

export const fontFamilyOpts: string[] = ["Serif", "Sans-serif", "Monospace", "Cursive", "Fantasy"]