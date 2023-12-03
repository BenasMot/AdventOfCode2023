export const toConsole = <T>(a: T): T => {
  console.log("###", a);
  return a;
};
