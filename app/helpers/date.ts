import { logError } from "./app";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
});

const dateAndTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export const formatDate = (
  date?: Date | null,
  type: "date_time" | "date" = "date"
) => {
  if (!date) return "N/E";
  try {
    if (type === "date") {
      return dateFormatter.format(date);
    }
    const result = dateAndTimeFormatter.format(date).split(", ");
    return `${result[0]} às  ${result[1]}`;
  } catch (error) {
    logError("formatDate", error);
    return "N/E";
  }
};
