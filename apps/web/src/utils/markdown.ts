import React from 'react';

interface MarkdownNode {
  type: 'text' | 'bold' | 'italic' | 'code' | 'codeblock' | 'link' | 'mention' | 'br';
  content?: string;
  children?: MarkdownNode[];
  href?: string;
}

export function getSafeMarkdownHref(href: string | undefined): string | null {
  if (!href) return null;

  try {
    const url = new URL(href);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Parse simple markdown into a flat list of nodes.
 * Supports: **bold**, *italic*, `code`, ```codeblock```, [text](url), @mention
 */
function parseMarkdown(text: string): MarkdownNode[] {
  const nodes: MarkdownNode[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Code block: ```...```
    const codeBlockMatch = remaining.match(/^```(?:\w*\n)?([\s\S]*?)```/);
    if (codeBlockMatch) {
      nodes.push({ type: 'codeblock', content: codeBlockMatch[1] });
      remaining = remaining.slice(codeBlockMatch[0].length);
      continue;
    }

    // Inline code: `...`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      nodes.push({ type: 'code', content: codeMatch[1] });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Bold: **...**
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) {
      nodes.push({ type: 'bold', content: boldMatch[1] });
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic: *...*
    const italicMatch = remaining.match(/^\*(.+?)\*/);
    if (italicMatch) {
      nodes.push({ type: 'italic', content: italicMatch[1] });
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      nodes.push({ type: 'link', content: linkMatch[1], href: linkMatch[2] });
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Mention: @username
    const mentionMatch = remaining.match(/^@(\w+)/);
    if (mentionMatch) {
      nodes.push({ type: 'mention', content: `@${mentionMatch[1]}` });
      remaining = remaining.slice(mentionMatch[0].length);
      continue;
    }

    // Newline
    if (remaining[0] === '\n') {
      nodes.push({ type: 'br' });
      remaining = remaining.slice(1);
      continue;
    }

    // Plain text: consume until next special character
    const nextSpecial = remaining.slice(1).search(/[`*\[@\n]/);
    if (nextSpecial === -1) {
      nodes.push({ type: 'text', content: remaining });
      remaining = '';
    } else {
      nodes.push({ type: 'text', content: remaining.slice(0, nextSpecial + 1) });
      remaining = remaining.slice(nextSpecial + 1);
    }
  }

  return nodes;
}

/**
 * Render markdown string into React elements.
 */
export function renderMarkdown(text: string): React.ReactNode[] {
  const nodes = parseMarkdown(text);

  return nodes.map((node, i) => {
    switch (node.type) {
      case 'bold':
        return React.createElement('strong', { key: i, className: 'font-semibold' }, node.content);
      case 'italic':
        return React.createElement('em', { key: i, className: 'italic' }, node.content);
      case 'code':
        return React.createElement(
          'code',
          {
            key: i,
            className: 'bg-elevated px-1.5 py-0.5 rounded text-sm font-mono text-accent-light',
          },
          node.content,
        );
      case 'codeblock':
        return React.createElement(
          'pre',
          {
            key: i,
            className:
              'bg-elevated rounded-lg p-3 my-1 text-sm font-mono overflow-x-auto text-text-primary',
          },
          React.createElement('code', null, node.content),
        );
      case 'link':
        const href = getSafeMarkdownHref(node.href);
        if (!href) {
          return React.createElement(React.Fragment, { key: i }, node.content);
        }
        return React.createElement(
          'a',
          {
            key: i,
            href,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'text-accent hover:underline',
          },
          node.content,
        );
      case 'mention':
        return React.createElement(
          'span',
          {
            key: i,
            className:
              'bg-accent/20 text-accent px-1 rounded font-medium cursor-pointer hover:bg-accent/30',
          },
          node.content,
        );
      case 'br':
        return React.createElement('br', { key: i });
      case 'text':
      default:
        return React.createElement(React.Fragment, { key: i }, node.content);
    }
  });
}
