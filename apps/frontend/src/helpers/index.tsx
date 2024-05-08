import escapeHTML from "escape-html";
import { Text } from "slate";
import { OpenAIResponseData, themes } from "../types";

export const addClassToSvgString = (svgString: string, className: string) => {
  if (!svgString) return svgString;
  return svgString.replace("<svg ", `<svg class="${className}" `);
};

export const getHeaderName = (path: string) => {
  if (path === "/") return "";
  if (path.includes("/employee")) return "Employee Satisfaction Survey";
  if (path.includes("/employee-benefits")) return "Employee Benefits";
  if (path.includes("/survey/fnb")) return "Survey F&B";
  if (path.includes("/survey/retail")) return "Survey Retail";
  if (path.includes("/chat")) return "Chat DO";
  if (path.includes("/clubprintemps")) return "Club Printemps";
  if (path.includes("/dohaquest")) return "Doha Quest";

  return "";
};

export const getPageConfig = (path: string): { header: string; theme: themes } => {
  const header = getHeaderName(path);
  let theme: themes = "dohaoasis";

  if (header === "Employee Benefits") theme = "dohaoasis";
  if (header === "Employee Satisfaction Survey") theme = "dohaoasis";
  if (header === "Survey F&B") theme = "printemps";
  if (header === "Survey Retail") theme = "printemps";
  if (header === "Chat DO") theme = "dohaoasis";
  if (header === "Club Printemps") theme = "printemps";
  if (header === "Doha Quest") theme = "dohaquest";

  return { header, theme };
};

export const updateCurrentDate = (currentDate: string, newDate: string) => {
  let returnValue = new Date(currentDate);
  const dateValue = new Date(newDate);

  returnValue.setDate(dateValue.getDate());
  returnValue.setMonth(dateValue.getMonth());
  returnValue.setFullYear(dateValue.getFullYear());

  return returnValue.toISOString();
};

interface CustomTextNode {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

interface CustomLinkElement {
  type: "link";
  url: string;
  children: CustomNode[];
}

type CustomElement = {
  type: "paragraph" | "quote" | "li" | "ul" | "upload";
  value: any;
  children: CustomNode[];
};

// Define a union type that includes Text, elements, and any custom types
export type CustomNode = CustomTextNode | CustomElement | CustomLinkElement;

export const serializeRichText = (node: CustomNode | Text): string => {
  if (Text.isText(node)) {
    let string = escapeHTML(node.text);
    if ((node as CustomTextNode).bold) {
      string = `<strong>${string}</strong>`;
    }
    return string;
  }

  const children = node.children
    .map((n) => serializeRichText(n as CustomNode))
    .join("");

  switch (node.type) {
    case "quote":
      return `<blockquote><p>${children}</p></blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "link":
      return `<a href="${escapeHTML(node.url)}">${children}</a>`;
    case "li":
      return `<li>${children}</li>`;
    case "ul":
      return `<ul>${children}</ul>`;
    case "upload":
      return `<img src="${node.value?.url || ""}"/>`;

    default:
      return children;
  }
};

export const updateCurrentTime = (currentDate: string, newTime: string) => {
  let returnValue = new Date(currentDate);

  const time = newTime.split(":");
  const hours = Number(time[0]);
  const mins = Number(time[1]);

  returnValue.setHours(hours, mins, 0, 0);

  return returnValue.toISOString();
};

export const getVideoInputDevices = async (): Promise<MediaDeviceInfo[]> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "videoinput");
  } catch (error) {
    console.error("Error enumerating devices:", error);
    return [];
  }
};

export const clearCitations = (data: OpenAIResponseData): string => {
  if (!data.content) return "";

  const content = data.content[0];
  let text = content.text.value;
  let annotations = content.text.annotations || [];
  const hasAnnotations = annotations ? annotations.length > 0 : false;

  if (hasAnnotations) {
    annotations.forEach((an) => {
      text = text.replaceAll(
        an.text,
        an.file_citation.quote ? ` #source: \`${an.file_citation.quote}\` ` : "",
      );
    });
  }

  return `${text}`;
};
