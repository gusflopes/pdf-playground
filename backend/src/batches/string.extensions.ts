interface String {
  prefix(pre: string): string;
  regexIndexOf(regex: RegExp | string, startpos: number): number;
  regexLastIndexOf(regex: RegExp, startpos: number): number;
}

String.prototype.prefix = function (pre: string) {
  return pre + this;
};

String.prototype.regexIndexOf = function (regex, startpos) {
  const indexOf = this.substring(startpos || 0).search(regex);
  return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
};

String.prototype.regexLastIndexOf = function (regex: RegExp, startpos: number) {
  regex = regex.global
    ? regex
    : new RegExp(
        regex.source,
        'g' + (regex.ignoreCase ? 'i' : '') + (regex.multiline ? 'm' : ''),
      );
  if (typeof startpos == 'undefined') {
    startpos = this.length;
  } else if (startpos < 0) {
    startpos = 0;
  }
  const stringToWorkWith = this.substring(0, startpos + 1);
  let lastIndexOf = -1;
  let nextStop = 0;
  let result: any;
  while ((result = regex.exec(stringToWorkWith)) != null) {
    lastIndexOf = result.index;
    regex.lastIndex = ++nextStop;
  }
  return lastIndexOf;
};
