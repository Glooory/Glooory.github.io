import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type FormateType =
  | "YYYY/MM/DD"
  | "YYYY/MM/DD HH:mm"
  | "YYYY/MM/DD HH:mm:ss"
  | "YYYY-MM-DD"
  | "YYYY-MM-DD HH:mm"
  | "YYYY-MM-DD HH:mm:ss"
  | "YYYY年MM月DD日(dd)"
  | "YYYY年MM月DD日";

export const formatDate = (date: string | Date, formate: FormateType = "YYYY/MM/DD") => {
  if (date === "") {
    return "";
  }

  return dayjs(date).format(formate);
};
