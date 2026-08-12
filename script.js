const postList = document.getElementById('postList');
const postTitle = document.getElementById('postTitle');
const postDate = document.getElementById('postDate');
const postDescription = document.getElementById('postDescription');
const postBody = document.getElementById('postBody');
const postContainer = document.getElementById('postContainer');
const fallback = document.getElementById('fallback');
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

const storageKey = 'blog-theme';
const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  const icon = themeToggle.querySelector('.theme-icon');
  if (icon) {
    const isDark = theme === 'dark';
    icon.innerHTML = isDark
      ? '<circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
      : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  localStorage.setItem(storageKey, theme);
}

function loadTheme() {
  const saved = localStorage.getItem(storageKey);
  setTheme(saved === 'dark' || saved === 'light' ? saved : defaultTheme);
}

function safeHTML(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightCode(raw, lang) {
  if (!lang) return escapeHtml(raw);

  const patterns = [];
  const lower = lang.toLowerCase();
  const jsKeywords = [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'switch', 'case',
    'break', 'continue', 'class', 'extends', 'import', 'from', 'export', 'default', 'new',
    'try', 'catch', 'finally', 'throw', 'await', 'async', 'yield', 'typeof', 'instanceof', 'this', 'super', 'static'
  ];
  const jsLiterals = ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'];
  const shellKeywords = ['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'in', 'export', 'unset'];

  const wrap = (text, type) => `<span class="token-${type}">${text}</span>`;
  const buildPattern = (source, flags = 'g') => new RegExp(source, flags);

  if (/^(js|javascript|ts|typescript|json)$/.test(lower)) {
    patterns.push({ regex: /\/\*[\s\S]*?\*\//g, type: 'comment' });
    patterns.push({ regex: /\/\/[^\n]*/g, type: 'comment' });
    patterns.push({ regex: /"(?:\\.|[^"\\])*"/g, type: 'string' });
    patterns.push({ regex: /'(?:\\.|[^'\\])*'/g, type: 'string' });
    patterns.push({ regex: /`(?:\\.|[^`\\])*`/g, type: 'string' });
    patterns.push({ regex: buildPattern(`\\b(?:${jsKeywords.join('|')})\\b`, 'g'), type: 'keyword' });
    patterns.push({ regex: buildPattern(`\\b(?:${jsLiterals.join('|')})\\b`, 'g'), type: 'literal' });
    patterns.push({ regex: /\b\d+(?:\.\d+)?\b/g, type: 'number' });
    patterns.push({ regex: /\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\()/g, type: 'function' });
  } else if (/^(bash|sh|zsh|shell)$/.test(lower)) {
    patterns.push({ regex: /#[^\n]*/g, type: 'comment' });
    patterns.push({ regex: /"(?:\\.|[^"\\])*"/g, type: 'string' });
    patterns.push({ regex: /'(?:\\.|[^'\\])*'/g, type: 'string' });
    patterns.push({ regex: /\$[A-Za-z_][A-Za-z0-9_]*/g, type: 'variable' });
    patterns.push({ regex: buildPattern(`\\b(?:${shellKeywords.join('|')})\\b`, 'g'), type: 'keyword' });
    patterns.push({ regex: /\b\d+(?:\.\d+)?\b/g, type: 'number' });
  } else {
    return escapeHtml(raw);
  }

  let highlighted = '';
  let position = 0;

  while (position < raw.length) {
    let matched = false;
    for (const { regex, type } of patterns) {
      regex.lastIndex = position;
      const match = regex.exec(raw);
      if (match && match.index === position) {
        highlighted += wrap(escapeHtml(match[0]), type);
        position += match[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      highlighted += escapeHtml(raw[position]);
      position += 1;
    }
  }

  return highlighted;
}

function parseMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLanguage = '';
  let listType = null;
  let listOpen = false;

  const closeList = () => {
    if (!listOpen) return;
    html.push(`</${listType}>`);
    listOpen = false;
    listType = null;
  };

  for (let rawLine of lines) {
    let line = rawLine;
    const codeFenceMatch = line.match(/^\s*```(\w+)?/);
    if (codeFenceMatch) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBuffer = [];
        codeLanguage = codeFenceMatch[1] ? codeFenceMatch[1].toLowerCase() : '';
      } else {
        const codeHtml = highlightCode(codeBuffer.join('\n'), codeLanguage);
        const className = codeLanguage ? `language-${codeLanguage}` : '';
        html.push(`<pre><code class="${className}">${codeHtml}</code></pre>`);
        inCodeBlock = false;
        codeLanguage = '';
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (/^\s*$/.test(line)) {
      closeList();
      continue;
    }

    const hrMatch = line.match(/^\s*((\*{3,})|(-{3,})|(_{3,}))\s*$/);
    if (hrMatch) {
      closeList();
      html.push('<hr />');
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      const content = parseInline(headingMatch[2]);
      html.push(`<h${level}>${content}</h${level}>`);
      continue;
    }

    const blockquoteMatch = line.match(/^\s*>\s?(.*)$/);
    if (blockquoteMatch) {
      closeList();
      html.push(`<blockquote>${parseInline(blockquoteMatch[1])}</blockquote>`);
      continue;
    }

    const unorderedMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    const orderedMatch = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (unorderedMatch || orderedMatch) {
      const type = unorderedMatch ? 'ul' : 'ol';
      const content = parseInline(unorderedMatch ? unorderedMatch[1] : orderedMatch[2]);
      if (!listOpen || listType !== type) {
        closeList();
        listType = type;
        html.push(`<${type}>`);
        listOpen = true;
      }
      html.push(`<li>${content}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${parseInline(line)}</p>`);
  }

  closeList();
  return html.join('\n');
}

function parseInline(text) {
  let result = safeHTML(text);
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  result = result.replace(/\[!((?:https?:\/\/|www\.)[^\]\s]+)\]/g, '<a href="$1" target="_blank" rel="noreferrer noopener">$1</a>');
  result = result.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>');
  return result;
}

function setActivePostCard(postSlug) {
  const cards = postList.querySelectorAll('.post-card');
  cards.forEach((card) => {
    const isActive = card.dataset.slug === postSlug;
    card.classList.toggle('is-active', isActive);
    if (isActive) {
      card.setAttribute('aria-current', 'true');
    } else {
      card.removeAttribute('aria-current');
    }
  });
}

async function loadPostList() {
  try {
    const response = await fetch('posts/index.json');
    const posts = await response.json();
    postList.innerHTML = '';

    posts.forEach((post, index) => {
      const card = document.createElement('a');
      card.href = '#';
      card.className = 'post-card';
      card.dataset.slug = post.slug;
      card.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <time>${post.date}</time>
      `;
      card.addEventListener('click', (event) => {
        event.preventDefault();
        openPost(post);
      });
      postList.append(card);
      if (index === 0) {
        openPost(post);
      }
    });
  } catch (error) {
    postList.innerHTML = '<p class="panel-copy">Unable to load posts. Confirm <code>posts/index.json</code> exists and is valid JSON.</p>';
    console.error(error);
  }
}

async function openPost(post) {
  try {
    const response = await fetch(`posts/${post.slug}.md`);
    if (!response.ok) throw new Error('Post not found');
    const markdown = await response.text();
    postTitle.textContent = post.title;
    postDate.textContent = post.date;
    postDescription.textContent = post.description;
    postBody.innerHTML = parseMarkdown(markdown);
    postContainer.classList.remove('hidden');
    fallback.classList.add('hidden');
    setActivePostCard(post.slug);
  } catch (error) {
    postBody.innerHTML = `<p>Unable to load this post.</p>`;
    postContainer.classList.remove('hidden');
    fallback.classList.add('hidden');
    console.error(error);
  }
}

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

loadTheme();
loadPostList();
