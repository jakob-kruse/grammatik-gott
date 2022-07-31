import axios from "axios";
import { config } from "./config";

function includes(match: string) {
  return (text: string) => {
    return text.toLocaleLowerCase().includes(match);
  };
}

const corrections: Array<{
  rule: string;
  filter: (text: string) => boolean;
  onCorrect: () => string;
}> = [
  {
    rule: "SEIT_VS_SEID",
    filter: includes("seit"),
    onCorrect() {
      return "seid*";
    },
  },
  {
    rule: "SEIT_VS_SEID",
    filter: includes("seid"),
    onCorrect() {
      return "seit*";
    },
  },
];

const http = axios.create({
  baseURL: config.LANGUAGE_TOOL_SERVER_URL,
});

export type LTMatch = {
  message: string;
  shortMessage: string;
  replacements: Array<{
    value: string;
  }>;
  offset: number;
  length: number;
  context: {
    text: string;
    offset: number;
    length: number;
  };
  sentence: string;
  type: {
    typeName: string;
  };
  rule: {
    id: "SEIT_VS_SEID" | string;
  };
};

export async function checkText(
  text: string,
  enabledRules: Array<string>
): Promise<Array<LTMatch>> {
  const res = await http.get("/v2/check", {
    params: {
      language: "de-DE",
      text,
      enabledRules: enabledRules.join(","),
      enabledOnly: true,
    },
  });

  return res.data.matches;
}

export async function filterTweetText(text: string) {
  const matchingCorrections = corrections.filter((correction) =>
    correction.filter(text)
  );

  const randomCorrection =
    matchingCorrections[Math.floor(Math.random() * matchingCorrections.length)];

  if (!randomCorrection) {
    return;
  }

  const matches = await checkText(text, [randomCorrection.rule]);

  if (matches.length === 0) {
    return randomCorrection.onCorrect();
  }
}
