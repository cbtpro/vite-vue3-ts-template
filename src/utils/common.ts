/**
 * 判断属性是否存在对象中
 * @param key 属性
 * @param object 对象
 * @returns 是否是对象的属性
 */
export function isValidKey(
  key: string | number | symbol,
  object: object,
): key is keyof typeof object {
  return key in object;
}
