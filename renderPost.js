const remark = require('remark');
const mermaid = require('remark-mermaid');
const slug = require('remark-slug')
const gemojiToEmoji = require('remark-gemoji-to-emoji');
const html = require('remark-html')

const pipeline = remark()
  .data('settings', {gfm: true})
  .use(slug)
  .use(mermaid, {simple: true})
  .use(gemojiToEmoji)
  .use(html)

const wrapper = (title, description, author, {ctime, mtime}, content) => `
<!DOCTYPE html>
<title>${title}</title>
<meta charset="utf-8"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="description" content="${description}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<style>
  @import url('../../style.css')
</style>
<main>
${content}
</main>
<footer>
  <div>By ${author}</div>
  <div>Published on ${ctime.getFullYear()}/${ctime.getMonth()+1}/${ctime.getDate()}</div>
  <div>Last updated on ${mtime.getFullYear()}/${mtime.getMonth()+1}/${mtime.getDate()}</div>
</footer>
`
// The first h1 or h2 tag is the title
const TITLE_PATTERN = /<h1.*>(.+)<\/h1>|<h2.*>(.+)<\/h2>/i

// The first paragraph is the description
const PARAGRAPH_PATTERN = /<p>(.+)<\/p>/i

module.exports = async function renderPost(content, author, stat={}, path='/') {
  return new Promise((resolve, reject) => {
    pipeline.process(content, (err, rendered) => {
      if(err) return reject(err)
      const {contents} = rendered

      const titleMatch = contents.match(TITLE_PATTERN)
      const title = titleMatch ? (titleMatch[1] ||titleMatch[2] || path) : path
      const descriptionMatch = contents.match(PARAGRAPH_PATTERN)
      const description = descriptionMatch ? descriptionMatch[1] : title

      const final = wrapper(title, description, author, stat, contents)
      resolve(final)
    })
  })
}
