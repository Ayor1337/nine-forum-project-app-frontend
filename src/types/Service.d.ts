interface Response {
  code: number;
  message: string;
  data: object;
}

interface SearchParams {
  q: string;
  topicId?: number;
  enableHistory?: boolean;
  onlyThreadTopic?: boolean;
  startTime?: number | null;
  endTime?: number | null;
  order?: string;
  page: number;
}
