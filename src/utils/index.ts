const seasonFormat = (str: string) => {
  const regex = /^\d{4}\/\d{4}$/;

  if (!regex.test(str)) {
    return false;
  }

  const [year1, year2] = str.split("/").map(Number);

  return year2 === year1 + 1;
};

export { seasonFormat };
