new Function (
  (function (a, b, c, d, m, o) {
    m = String;
    if (!"".replace(/^/, String)) {
      while (c--) o[c] = d[c] || c;
      d = [
        function (m) {
          return o[m];
        },
      ];
      e = function () {
        return "\\w+";
      };
      c = 1;
    }
    while (c--) if (d[c]) a = a.replace(new RegExp("\\b" + e(c) + "\\b", "g"), d[c]);
    return a;
  })("$.1('/2/3/4/0/5-6.0');", 7, 7, "js|getScript|hckang|guide|assets|p|func".split("|"), 0, {})
)();