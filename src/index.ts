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

function createElement<T extends keyof HTMLElementTagNameMap>(tag: T, props: Partial<HTMLElementTagNameMap[T]> = {}): HTMLElementTagNameMap[T] {
  let { dataset, ...rest } = props;
  let element = Object.assign(document.createElement(tag), rest);

  if (dataset != null) {
    for (let key in dataset) {
      element.dataset[key] = dataset[key];
    }
  }

  return element;
}

type Html = { [key in keyof HTMLElementTagNameMap]: (props?: Partial<HTMLElementTagNameMap[key]>) => HTMLElementTagNameMap[key] };

const html = new Proxy<Html>({} as any, {
  get(target, prop: keyof HTMLElementTagNameMap) {
    if (prop in target) return target[prop];

    return (target[prop] = createElement.bind(target, prop));
  }
});

function initializeReveal() {
  let revealRoot = html.div({ className: 'reveal' });
  let slides = html.div({ className: 'slides' });

  for (const { default: content } of Object.values(markdownFiles)) {
    let section = html.section({ dataset: { markdown: '' } });

    let markdown = html.script({
      type: 'text/template',
      textContent: replaceBaseUrlMarkdown(content),
      dataset: { template: '' }
    });
    section.append(markdown);

    let wrapper = html.section();
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
