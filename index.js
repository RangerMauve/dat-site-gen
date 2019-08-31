const renderPost = require('./renderPost')
const debug = require('debug')('dat-site-gen')

const MD_FILE_PATTERN = /\.md$/i
const MD_FILE_NAME = /(.+)\.md$/i

module.exports = async function datSiteGen(archive) {
  let manifest = {}
  try {
    manifest = JSON.parse(await archive.readFile('/.dat-site-gen.json', 'utf8'))
  } catch(e) {
    debug('Unable to parse .dat-site-gen.json', e.message)
  }

  const lastGenerated = manifest['lastGenerated'] || 0
  const author = manifest['author'] || 'Anonymous'

  const posts = await archive.readdir('/posts/', {
    stat: true
  })

  const toGenerate = posts
    .filter(({stat}) => stat.mtime.getTime() > lastGenerated)
    .filter(({name}) => name.match(MD_FILE_PATTERN))
    .sort((a, b) => b.stat.ctime - a.stat.ctime)

  for(let {name, stat} of toGenerate) {
    const location = `/posts/${name}`
    const content = await archive.readFile(location, 'utf8')
    const rendered = await renderPost(content, author, stat, location)

    const filename = name.match(MD_FILE_NAME)[1]
    const postLocation = `/posts/${filename}.html`

    await archive.writeFile(postLocation, rendered)
  }
}
