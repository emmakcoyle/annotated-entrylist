import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "@quartz-community/types"

export default (() => {
  const EntryList: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    const slug = fileData.slug
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
      <div>
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