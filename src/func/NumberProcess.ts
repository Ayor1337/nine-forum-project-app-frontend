const numberProcess = (num: number) => {
  if (num < 1000) return num;
  else if (num < 10000) return (num / 1000).toFixed(1) + "K";
  else if (num < 1000000) return (num / 1000).toFixed(0) + "K";
  else if (num < 10000000) return (num / 1000000).toFixed(1) + "M";
  else return (num / 1000000).toFixed(0) + "M";
};

export { numberProcess };
