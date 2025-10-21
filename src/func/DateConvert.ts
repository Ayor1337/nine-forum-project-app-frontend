import dayjs from "dayjs";

const formatDate = (date: Date): string => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

export { formatDate };
