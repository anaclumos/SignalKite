import { LinguineCore } from './linguine.mjs'
import { translate } from './translate.mjs'

import fs from 'fs'

const main = async () => {
  const strings = {
    "Heimdall": {
      "message": "Heimdall"
    },
    "Heimdall summarizes Hacker News in 30 Languages.": {
      "message": "Heimdall summarizes Hacker News in 30 Languages."
    },
    "Trusted by Professionals at Apple, Microsoft, Amazon, and More.": {
      "message": "Trusted by Professionals at Apple, Microsoft, Amazon, and More."
    },
    "No Hidden Fees. Completely Free.": {
      "message": "No Hidden Fees. Completely Free."
    }
  }

  const translatedMap = {}

  await Promise.all(
    Object.keys(LinguineCore).map(async (locale) => {
      const localeCopy = structuredClone(strings)
      // translate the values of the copy
      await Promise.all(
        Object.keys(localeCopy).map(async (key) => {
          const translation = await translate([localeCopy[key].message], 'en', locale)
          localeCopy[key].message = translation[0]
        })
      )
      // add the translated copy to the translatedMap
      translatedMap[locale] = localeCopy
    })
  )

  await Promise.all(
    Object.keys(translatedMap).map(async (locale) => {
      const path = `i18n/${locale}/code.json`
      // we must append to the file, not overwrite it
      const json = JSON.parse(fs.readFileSync(path, 'utf8'))
      const newJson = {
        ...json,
        ...translatedMap[locale]
      }
      fs.writeFileSync(path, JSON.stringify(newJson, null, 2))

    })
  )
}

main().then(() => process.exit(0))
