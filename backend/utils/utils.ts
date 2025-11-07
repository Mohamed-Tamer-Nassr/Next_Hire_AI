export const getQueryStr = (
  searchParams: URLSearchParams
): { [key: string]: string } => {
  const queryStr: { [key: string]: string } = {};
  searchParams.forEach((value, key) => {
    queryStr[key] = value;
  });
  return queryStr;
};
