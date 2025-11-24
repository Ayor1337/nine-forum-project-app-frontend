interface Response {
  code: number;
  message: string;
  data: object;
}

interface SearchParams {
  q: string;
  page: number;
}
