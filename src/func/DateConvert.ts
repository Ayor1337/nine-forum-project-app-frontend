import { log } from "console";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);

const formatDate = (date: Date): string => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

const formatSmartTime = (
  from: string | Date,
  to: string | Date
): string | null => {
  const prev = dayjs(from);
  const target = dayjs(to);

  // 如果两者时间差不超过 6 小时，不显示
  const diffHours = target.diff(prev, "hour");
  if (diffHours <= 6) return null;

  const now = dayjs();
  const diffDays = now.startOf("day").diff(target.startOf("day"), "day");

  if (diffDays === 0) {
    return target.format("HH:mm");
  } else if (diffDays === 1) {
    return `昨天 ${target.format("HH:mm")}`;
  } else if (diffDays === 2) {
    return `前天 ${target.format("HH:mm")}`;
  } else if (target.isSame(now, "isoWeek")) {
    const weekdayMap = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    return `${weekdayMap[target.day()]} ${target.format("HH:mm")}`;
  } else {
    return target.format("YYYY/MM/DD HH:mm");
  }
};

export { formatDate, formatSmartTime };
