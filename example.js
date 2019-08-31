const {DatArchive, destroy} = require('dat-sdk/auto')
const datSiteGen = require('./')

process.once('SIGINT', destroy)

run()

async function run() {
  console.log('Forking Mauve\'s blog')
  const archive = await DatArchive.fork('dat://f276fed7a45ccd42d59fe912512b368e64b846fa8f15562aa6f65ea75dd9b0da', {
    persist: false
  })

  console.log('forked to', archive.url)

  console.log('running site generator')

  await datSiteGen(archive)

  console.log('finished, try viewing in Beaker')

  console.log(`${archive.url}/posts/`)
}
