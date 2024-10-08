import TurndownService from 'turndown'

// Use a singleton TurndownService instance for performance
const turndownService = new TurndownService({
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
})
// ignore these elements from the conversion to markdown.
turndownService.remove([
  'script',
  'style',
  'link',
  'img',
  // 'a',
  'meta',
  'head',
  'title',
  'base',
  'canvas',
  'embed',
  'iframe',
])

// Note: Consider removing these elements as well if they get in the way. We should generally avoid
// changing link content.
// We don't want to translate nav items because we want to keep as low-profile as possible. Causing friction in high-click areas could be frustrating for users.
turndownService.remove('nav')
turndownService.addRule('ignore-links', {
  filter: (node) => node.nodeName === 'A',
  replacement: (content, node) => '',
})

export function htmlToMarkdown(element: Element): string {
  // Convert HTML to Markdown directly from the element's innerHTML
  const markdown = turndownService.turndown(element.innerHTML)

  return markdown
}
