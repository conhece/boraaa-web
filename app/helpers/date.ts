import { dayjs } from "@/lib/dayjs";
import type { PublicEvent } from "@/lib/types/event";

export const getSummaryDates = (schedule?: PublicEvent["schedule"]) => {
  if (!schedule) return "";
  const startDate = schedule[0].startDate;
  const endDate = schedule[schedule.length - 1].endDate;
  const start = dayjs(startDate).format("DD/MM");
  const end = dayjs(endDate).format("DD/MM");
  if (start === end) return start;
  const preposition = schedule.length > 2 ? "a" : "e";
  return `${start} ${preposition} ${end}`;
};

export const getDetailsDates = (schedule?: PublicEvent["schedule"]) => {
  if (!schedule) return [];
  const dates = schedule
    .map((item) => dayjs(item.startDate))
    .filter((date) => date.isSameOrAfter(dayjs()));
  return dates.map((date) => date.format("ddd DD/MM HH:mm"));
};
