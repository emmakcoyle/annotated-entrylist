import { createRequire } from 'module';

createRequire(import.meta.url);
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, o2, r2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((o2 = i2.constructor) && null != o2.getDerivedStateFromError && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// src/components/EntryList.tsx
function slugifyName(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
var EntryList_default = (() => {
  const EntryList = ({ fileData, allFiles }) => {
    const slug = fileData.slug;
    if (slug === "bibliography") {
      const nameSet = /* @__PURE__ */ new Set();
      allFiles.forEach((f3) => {
        const authors = f3.frontmatter?.authors;
        if (Array.isArray(authors)) {
          authors.forEach((a2) => {
            if (a2) nameSet.add(String(a2));
          });
        }
      });
      const names = Array.from(nameSet).sort((a2, b) => a2.localeCompare(b));
      if (names.length === 0) return null;
      return /* @__PURE__ */ u2("div", { class: "entry-list-block", children: /* @__PURE__ */ u2("ul", { class: "bib-name-list", children: names.map((n2, i2) => /* @__PURE__ */ u2("li", { children: /* @__PURE__ */ u2("a", { href: `/tags/${slugifyName(n2)}`, style: "color:inherit; text-decoration:none;", children: n2 }) }, i2)) }) });
    }
    let type = null;
    let limit = void 0;
    if (slug === "sources") type = "source";
    else if (slug === "ideas") type = "idea";
    else if (slug === "publications") type = "publication";
    else if (slug === "index") limit = 5;
    else return null;
    let entries = allFiles.filter((f3) => f3.frontmatter?.type === type || slug === "index" && f3.frontmatter?.type);
    entries.sort((a2, b) => (b.dates?.modified?.getTime() ?? 0) - (a2.dates?.modified?.getTime() ?? 0));
    if (limit) entries = entries.slice(0, limit);
    if (entries.length === 0) return null;
    return /* @__PURE__ */ u2("div", { class: "entry-list-block", children: entries.map((e2, i2) => /* @__PURE__ */ u2("div", { class: "entry", children: [
      /* @__PURE__ */ u2("span", { class: "num", children: String(e2.frontmatter?.coordinate ?? "") }),
      /* @__PURE__ */ u2("div", { children: [
        /* @__PURE__ */ u2("p", { class: "title", children: /* @__PURE__ */ u2("a", { href: `/${e2.slug}`, style: "color:inherit;text-decoration:none;", children: String(e2.frontmatter?.title ?? "") }) }),
        /* @__PURE__ */ u2("p", { class: "dek", children: String(e2.frontmatter?.description ?? "") }),
        /* @__PURE__ */ u2("span", { class: "mode", children: String(e2.frontmatter?.mode ?? "") })
      ] }),
      /* @__PURE__ */ u2("span", { class: "kind", children: String(e2.frontmatter?.kind ?? "") })
    ] }, i2)) });
  };
  return EntryList;
});

export { EntryList_default as EntryList };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map