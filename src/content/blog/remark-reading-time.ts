import { visit } from "unist-util-visit";

type TextNode = {
  type: string;
  value?: string;
};

type RootNode = {
  type: string;
  children?: Array<RootNode | TextNode>;
};

export type RemarkReadingTimeOptions = {
  wordsPerMinute?: number;
  attribute?: string;
};

type ReadingTimeData = {
  text: string;
  minutes: number;
  words: number;
};

function countWords(text: string): number {
  const normalized = text.trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).length;
}

export function remarkReadingTime(options: RemarkReadingTimeOptions = {}) {
  const wordsPerMinute = options.wordsPerMinute ?? 200;
  const attribute = options.attribute ?? "readingTime";

  return (tree: RootNode, file: { data: Record<string, unknown> }) => {
    const chunks: string[] = [];

    visit(tree, "text", (node: TextNode) => {
      chunks.push(node.value ?? "");
    });

    const words = countWords(chunks.join(" "));
    const minutes =
      words === 0 ? 1 : Math.max(1, Math.ceil(words / wordsPerMinute));
    const readingTime: ReadingTimeData = {
      text: `${minutes} min read`,
      minutes,
      words,
    };

    file.data[attribute] = readingTime;
  };
}
