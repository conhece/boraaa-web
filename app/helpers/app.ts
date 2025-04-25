export const logArgs = (label: string, value?: unknown) => {
  if (process.env.NODE_ENV !== "development") return;
  if (!value) {
    console.log(`(DEV) ${label}`);
  } else {
    console.log(`(DEV) ${label}`, value);
  }
};

export const logError = (funcName: string, error: unknown) => {
  // if (process.env.NODE_ENV === "production") {
  //   captureException(funcName, error);
  // }
  return console.log(`%c${funcName} error: `, "color: red", error);
};
