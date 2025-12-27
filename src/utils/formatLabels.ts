export function formatEnumLabel(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
}

export function formatEnumList(values: string[], max?: number): string {
  const list = values.map(formatEnumLabel);
  if (max === undefined || list.length <= max) {
    return list.join(", ");
  }
  return `${list.slice(0, max).join(", ")} +${list.length - max}`;
}
