const toDecimal2 = (x: number) => {
  // let f = parseFloat(String(x));
  // if (isNaN(f)) {
  //   return false;
  // }
  // f = Math.round(x * 100) / 100;
  // let s = f.toString();
  // let rs = s.indexOf('.');
  // if (rs < 0) {
  //   rs = s.length;
  //   s += '.';
  // }
  // while (s.length <= rs + 2) {
  //   s += '0';
  // }
  // return s;

  // let f = parseFloat(String(x));
  // if (isNaN(f)) {
  //   return;
  // }
  return Math.round(x * 100) / 100;
}

export default toDecimal2;
