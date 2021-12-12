export function trimLength(string) {
  if (string) {
    let trimmedString = "";
    for (let i = 0; i < 55; i++) {
      trimmedString += string[i];
    }
    return string.length < 55 ? string : trimmedString + "...";
  }
  return string;
}
