import { copyFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const assetsDir = join(process.cwd(), 'dist', 'assets')
const files = readdirSync(assetsDir)
const currentJs = files.find((file) => /^index-.*\.js$/.test(file))
const currentCss = files.find((file) => /^index-.*\.css$/.test(file))

if (!currentJs || !currentCss) {
  throw new Error('Could not find built index JS/CSS assets.')
}

for (const legacyJs of ['index-BixZ00eL.js', 'index-BQv82KSz.js']) {
  copyFileSync(join(assetsDir, currentJs), join(assetsDir, legacyJs))
}

for (const legacyCss of ['index-ZqeAzQ3Y.css', 'index-C7YmU-sP.css']) {
  copyFileSync(join(assetsDir, currentCss), join(assetsDir, legacyCss))
}
