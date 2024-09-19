import './env'

import {
  generatePageTranslations,
  GeneratePageTranslationsSettings,
} from './ai/generatePageTranslations'
import { htmlToMarkdown } from './lib/htmlToMarkdown'
import { replaceTextSegments } from './lib/replaceTextSegments'
import { isCurrentSiteIgnored } from './lib/storage'

console.log('Content script loaded')

async function initializeLexaExtension() {
  const isIgnored = await isCurrentSiteIgnored()

  if (isIgnored) {
    if (__DEBUG__) {
      console.log('Lexa is disabled for this site')
    }
    return
  } else {
    // For now, we only want to translate crxjs.dev
    if (!location.href.includes('crxjs.dev')) {
      return
    }

    if (__DEBUG__) {
      console.log('Lexa is active on this site')
    }
  }

  // Define user preferences (these will later be dynamic)
  const userPreferences: GeneratePageTranslationsSettings = {
    targetLanguage: 'Spanish',
    learningGoals: 'Learn Spanish',
    proficiencyLevel: 'Intermediate',
    preferredPhraseLength: 'Short',
    translationDensityPercent: 10,
  }

  const markdown = htmlToMarkdown(document.body)
  console.log('Markdown:', { markdown })

  if (false) {
    const result = await generatePageTranslations(markdown, userPreferences)

    for await (const translation of result.elementStream) {
      // Replace the text segments in the DOM
      replaceTextSegments(document.body, [translation])
    }
  } else {
    // replaceTextSegments(document.body, [
    //   {
    //     original: 'host page',
    //     translation: 'página anfitriona',
    //     context: 'The page where the script runs is called the **host page**.',
    //   },
    // ])
    // replaceTextSegments(document.body, [
    //   {
    //     original: 'create our root element',
    //     translation: 'crear nuestro elemento raíz',
    //     context:
    //       "Content scripts don't use an HTML file, so we need to create our root element and append it to the DOM.",
    //   },
    // ])
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLexaExtension)
} else {
  initializeLexaExtension()
}

// Listen for updates to the ignored sites list
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === 'IGNORED_SITES_UPDATED') {
    initializeLexaExtension()
  }
})
