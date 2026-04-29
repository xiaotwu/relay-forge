import { describe, expect, it } from 'vitest';
import { getSafeMarkdownHref } from '../markdown';

describe('getSafeMarkdownHref', () => {
  it('allows http, https, and mailto links', () => {
    expect(getSafeMarkdownHref('https://example.com/path')).toBe('https://example.com/path');
    expect(getSafeMarkdownHref('http://example.com/')).toBe('http://example.com/');
    expect(getSafeMarkdownHref('mailto:hello@example.com')).toBe('mailto:hello@example.com');
  });

  it('blocks unsafe link schemes', () => {
    expect(getSafeMarkdownHref('javascript:alert(1)')).toBeNull();
    expect(getSafeMarkdownHref('data:text/html,<svg>')).toBeNull();
    expect(getSafeMarkdownHref('/relative')).toBeNull();
  });
});
