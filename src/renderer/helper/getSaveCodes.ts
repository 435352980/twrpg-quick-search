/**
 * 获取存档代码
 * @param {String} str
 */
const getSaveCodes = (source: string) =>
  source.match(/-load [a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/,'<>~\·`\?:;|]+/g);
export default getSaveCodes;
