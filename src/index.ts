import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';

const markdownFiles: Record<string, { default: string }> = import.meta.glob('../slides/*.md', {
  query: 'raw',
  eager: true,
});

function main() {
  initializeReveal();
}

function initializeReveal() {
  let revealRoot = document.createElement('div');
  revealRoot.className = 'reveal'

  let slides = document.createElement('div');
  slides.className = 'slides';

  for (const { default: content } of Object.values(markdownFiles)) {
    let section = document.createElement('section');
    section.dataset.markdown = '';

    let markdown = document.createElement('script');
    markdown.type = 'text/template';
    markdown.dataset.template = '';
    markdown.textContent = replaceBaseUrlMarkdown(content);
    section.append(markdown);

    let wrapper = document.createElement('section');
    wrapper.append(section)
    slides.append(wrapper);
  }

  revealRoot.append(slides);
  document.body.prepend(revealRoot);

  let deck = new Reveal({
    plugins: [Markdown, Highlight],
  });

  deck.initialize();
}

function replaceBaseUrlMarkdown(content: string) {
  return content.replace(/\]\(\//g, `](${import.meta.env.BASE_URL}`);
}

main();
