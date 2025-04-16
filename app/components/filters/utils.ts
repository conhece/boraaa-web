export const getFormDate = (dateString?: string) => {
  if (!dateString) return undefined;
  try {
    const [day, month, year] = dateString.split("/");
    return new Date(`${month}-${day}-${year}`);
  } catch (error) {
    console.log("getFormDate error: ", error);
    return undefined;
  }
};
