import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "@quartz-community/types"

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function lastName(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts[parts.length - 1] ?? name
}

export default (() => {
  const EntryList: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    const slug = fileData.slug

    if (slug === "bibliography") {
      const nameSet = new Set<string>()
      allFiles.forEach((f) => {
        const authors = f.frontmatter?.authors as string[] | undefined
        if (Array.isArray(authors)) {
          authors.forEach((a) => {
            if (a) nameSet.add(String(a))
          })
        }
      })
      const names = Array.from(nameSet).sort((a, b) => lastName(a).localeCompare(lastName(b)))
      if (names.length === 0) return null

      // group by first letter of last name
      const groups: { letter: string; names: string[] }[] = []
      names.forEach((n) => {
        const letter = lastName(n).charAt(0).toUpperCase()
        const lastGroup = groups[groups.length - 1]
        if (lastGroup && lastGroup.letter === letter) {
          lastGroup.names.push(n)
        } else {
          groups.push({ letter, names: [n] })
        }
      })

      return (
        <div class="entry-list-block">
          <p class="section-label">Authors, Thinkers &amp; Artists</p>
          {groups.map((g, gi) => (
            <div class="bib-letter-group" key={gi}>
              <p class="bib-letter">{g.letter}</p>
              <ul class="bib-name-list">
                {g.names.map((n, i) => (
                  <li key={i}>
                    <a href={`/tags/${slugifyName(n)}`} style="color:inherit; text-decoration:none;">
                      {n}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )
    }

    let type: string | null = null
    let limit: number | undefined = undefined

    if (slug === "sources") type = "source"
    else if (slug === "ideas") type = "idea"
    else if (slug === "publications") type = "publication"
    else if (slug === "index") limit = 5
    else return null

    let entries = allFiles.filter((f) => f.frontmatter?.type === type || (slug === "index" && f.frontmatter?.type))
    entries.sort((a, b) => (b.dates?.modified?.getTime() ?? 0) - (a.dates?.modified?.getTime() ?? 0))
    if (limit) entries = entries.slice(0, limit)
    if (entries.length === 0) return null

    return (
      <div class="entry-list-block">
        {entries.map((e, i) => (
          <div class="entry" key={i}>
            <span class="num">{String(e.frontmatter?.coordinate ?? "")}</span>
            <div>
              <p class="title"><a href={`/${e.slug}`} style="color:inherit;text-decoration:none;">{String(e.frontmatter?.title ?? "")}</a></p>
              <p class="dek">{String(e.frontmatter?.description ?? "")}</p>
              <span class="mode">{String(e.frontmatter?.mode ?? "")}</span>
            </div>
            <span class="kind">{String(e.frontmatter?.kind ?? "")}</span>
          </div>
        ))}
      </div>
    )
  }
  return EntryList
}) satisfies QuartzComponentConstructor