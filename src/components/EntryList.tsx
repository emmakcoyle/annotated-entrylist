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

function firstLetter(title: string): string {
  const c = title.trim().charAt(0).toUpperCase()
  return /[A-Z0-9]/.test(c) ? c : "#"
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function isTemplate(f: any): boolean {
  return typeof f.slug === "string" && f.slug.startsWith("templates/")
}

export default (() => {
  const EntryList: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    const slug = fileData.slug

    if (slug === "bibliography") {
      // --- Authors, Thinkers & Artists (existing) ---
      const nameSet = new Set<string>()
      allFiles.forEach((f) => {
        if (isTemplate(f)) return
        const authors = f.frontmatter?.authors as string[] | undefined
        if (Array.isArray(authors)) {
          authors.forEach((a) => {
            if (a) nameSet.add(String(a))
          })
        }
      })
      const names = Array.from(nameSet).sort((a, b) => lastName(a).localeCompare(lastName(b)))

      const authorGroups: { letter: string; names: string[] }[] = []
      names.forEach((n) => {
        const letter = lastName(n).charAt(0).toUpperCase()
        const lastGroup = authorGroups[authorGroups.length - 1]
        if (lastGroup && lastGroup.letter === letter) {
          lastGroup.names.push(n)
        } else {
          authorGroups.push({ letter, names: [n] })
        }
      })

      // --- All notes, by title only (new) ---
      const noteFiles = allFiles.filter((f) => !isTemplate(f) && Boolean(f.frontmatter?.type))
      const sortedTitles = [...noteFiles].sort((a, b) =>
        String(a.frontmatter?.title ?? "").localeCompare(String(b.frontmatter?.title ?? "")),
      )
      const titleGroups: { letter: string; entries: typeof sortedTitles }[] = []
      sortedTitles.forEach((e) => {
        const letter = firstLetter(String(e.frontmatter?.title ?? ""))
        const last = titleGroups[titleGroups.length - 1]
        if (last && last.letter === letter) last.entries.push(e)
        else titleGroups.push({ letter, entries: [e] })
      })

      // --- Every tag used site-wide (new) ---
      const allTagSet = new Set<string>()
      allFiles.forEach((f) => {
        if (isTemplate(f)) return
        const tags = f.frontmatter?.tags as string[] | undefined
        if (Array.isArray(tags)) tags.forEach((t) => t && allTagSet.add(String(t)))
      })
      const allTags = Array.from(allTagSet).sort((a, b) => a.localeCompare(b))

      if (authorGroups.length === 0 && titleGroups.length === 0 && allTags.length === 0) return null

      return (
        <div class="entry-list-block">
          {authorGroups.length > 0 && (
            <>
              <p class="section-label">Authors, Thinkers &amp; Artists</p>
              {authorGroups.map((g, gi) => (
                <div class="bib-letter-group" key={gi}>
                  <p class="bib-letter">{g.letter}</p>
                  <ul class="bib-name-list">
                    {g.names.map((n, i) => (
                      <li key={i}>
                        <a href={`./tags/${slugifyName(n)}`} style="color:inherit; text-decoration:none;">
                          {n}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}

          {titleGroups.length > 0 && (
            <>
              <p class="section-label" style="margin-top:2.4rem;">All Notes by Title</p>
              {titleGroups.map((g, gi) => (
                <div class="bib-letter-group" key={gi}>
                  <p class="bib-letter">{g.letter}</p>
                  <ul class="bib-name-list">
                    {g.entries.map((e, i) => (
                      <li key={i}>
                        <a href={`./${e.slug}`} style="color:inherit; text-decoration:none;">
                          {String(e.frontmatter?.title ?? "")}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}

          {allTags.length > 0 && (
            <div class="tag-browse" style="margin-top:2.4rem;">
              <p class="section-label">All Topics</p>
              <div class="tag-browse-list">
                {allTags.map((t, i) => (
                  <a key={i} href={`./tags/${t}`} class="tag-pill">{t}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    let type: string | null = null

    if (slug === "sources") type = "source"
    else if (slug === "ideas") type = "idea"
    else if (slug === "publications") type = "publication"
    else if (slug === "index") type = "__any__"
    else return null

    let entries = allFiles.filter(
      (f) =>
        !isTemplate(f) &&
        (type === "__any__" ? f.frontmatter?.type : f.frontmatter?.type === type),
    )

    entries.sort((a, b) => {
      const aPin = Number(a.frontmatter?.pinned) || 0
      const bPin = Number(b.frontmatter?.pinned) || 0
      if (aPin && bPin) return aPin - bPin
      if (aPin) return -1
      if (bPin) return 1

      const aDate = a.frontmatter?.date_published
        ? new Date(String(a.frontmatter.date_published)).getTime()
        : (a.dates?.modified?.getTime() ?? 0)
      const bDate = b.frontmatter?.date_published
        ? new Date(String(b.frontmatter.date_published)).getTime()
        : (b.dates?.modified?.getTime() ?? 0)
      return bDate - aDate
    })

    let tagBlock = null
    if (slug === "sources" || slug === "ideas" || slug === "publications") {
      const tagSet = new Set<string>()
      allFiles.forEach((f) => {
        if (isTemplate(f)) return
        if (f.frontmatter?.type === type) {
          const tags = f.frontmatter?.tags as string[] | undefined
          if (Array.isArray(tags)) tags.forEach((t) => t && tagSet.add(String(t)))
        }
      })
      const tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b))
      if (tags.length > 0) {
        tagBlock = (
          <div class="tag-browse">
            <p class="section-label">Browse by tag</p>
            <div class="tag-browse-list">
              {tags.map((t, i) => (
                <a key={i} href={`./tags/${t}`} class="tag-pill">{t}</a>
              ))}
            </div>
          </div>
        )
      }
    }

    if (entries.length === 0 && !tagBlock) return null

    return (
      <div class="entry-list-block">
        {tagBlock}
        {entries.length > 0 && (
          <>
            <p class="section-label">All entries</p>
            {entries.map((e, i) => {
              const dateStr = e.frontmatter?.date_published
                ? formatDate(String(e.frontmatter.date_published))
                : ""
              return (
                <div class="entry" key={i}>
                  <span class="num">{String(e.frontmatter?.coordinate ?? "")}</span>
                  <div>
                    <p class="title"><a href={`./${e.slug}`} style="color:inherit;text-decoration:none;">{String(e.frontmatter?.title ?? "")}</a></p>
                    <p class="dek">{String(e.frontmatter?.description ?? "")}</p>
                    <span class="mode">{String(e.frontmatter?.mode ?? "")}</span>
                  </div>
                  <div class="entry-meta">
                    <span class="kind">{String(e.frontmatter?.kind ?? "")}</span>
                    {dateStr ? <span class="date">{dateStr}</span> : null}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    )
  }
  return EntryList
}) satisfies QuartzComponentConstructor
