export default function calcBusiness(M) {
  var e = function (M) {
    return "number" == typeof parseInt(M, 10) && parseInt(M, 10) > 0 ? parseInt(M, 10) : 0;
  },
  t = M.entityType,
  u = M.filingStatus,
  s = e(M.revenue),
  a = e(M.expenses),
  N = e(M.entertainment),
  j = e(M.estimatedPayments),
  D = 0,
  i = 0,
  w = 0,
  n = function () {
    switch (u) {
      case "mfj":
        return { from: [0, 19400, 78950, 168400, 321450, 408200, 612350], rates: [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37], cumulative: [0, 1940, 9086, 28765, 65497, 93257, 164709.5] };
      case "mfs":
        return { from: [0, 9700, 39475, 84200, 160725, 204100, 306750], rates: [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37], cumulative: [0, 970, 4543, 14382.5, 32748.5, 46628.5, 82556] };
      case "hh":
        return { from: [0, 13850, 52850, 84200, 160700, 204100, 510300], rates: [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37], cumulative: [0, 1385, 6065, 12962, 31322, 45210, 152380] };
      case "qw":
        return { from: [0, 19400, 78950, 168400, 321450, 408200, 612350], rates: [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37], cumulative: [0, 1940, 9086, 28765, 65497, 93257, 164709.5] };
      case "s":
      default:
        return { from: [0, 9700, 39475, 84200, 160725, 204100, 510300], rates: [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37], cumulative: [0, 970, 4543, 14382.5, 32748.5, 46628.5, 153798.5] };
    }
  };
  if (((i = s - (a - N) - 0.5 * N), "C-Corporation" === t || "LLC - C-Corp" === t))
    w = 0.21 * i - j;
  else {
    var y = 0;
    switch (u) {
      case "s":
      case "mfs":
        y = 12e3;
        break;
      case "hh":
        y = 18e3;
        break;
      case "mfj":
      case "qw":
        y = 24e3;
    }
    (i -= y),
      (D =
        (D =
          n().from.findIndex(function (M) {
            return M > i;
          }) - 1) < 0
          ? 6
          : D),
      (w = (i - n().from[D]) * n().rates[D] + n().cumulative[D] - j);
  }

  return w;
}