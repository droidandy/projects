type E = { id?: string | number; xmlId?: string | number; __typename?: string };
/**
 * Генерирует уникальный ключ для серверных сущностей, предназначен для FlatList, может
 * использоваться в других местах.
 * @param {string | number} [id]
 * @param {string | number} [xmlId]
 * @param {string} __typename
 * @param {number} index
 */
export function keyExtractor<T extends E>({ id, xmlId, __typename }: T, index: number): string {
  const realId = id !== null && id !== undefined ? id : xmlId;
  return `${__typename || index.toString()}:${realId}`;
}
