import { useEffect, useId, useState } from 'react';
import { DocIcon } from './DocIcons';

interface MermaidDiagramProps {
  chart: string;
  title: string;
  eyebrow?: string;
  note?: string;
}

let mermaidInitialized = false;
let mermaidPromise: Promise<(typeof import('mermaid'))['default']> | null = null;

async function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((module) => module.default);
  }

  const mermaid = await mermaidPromise;

  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif',
      themeVariables: {
        background: '#fcfcfa',
        primaryColor: '#ffffff',
        primaryTextColor: '#111827',
        primaryBorderColor: '#d8dccf',
        lineColor: '#6b7280',
        secondaryColor: '#f4f5f0',
        tertiaryColor: '#fff2e2',
        mainBkg: '#ffffff',
        nodeBorder: '#d8dccf',
        clusterBkg: '#f6f7f3',
        clusterBorder: '#d8dccf',
        defaultLinkColor: '#8b5cf6',
        titleColor: '#111827',
        edgeLabelBackground: '#fcfcfa',
        textColor: '#111827',
        fontSize: '15px',
      },
      flowchart: {
        curve: 'basis',
        useMaxWidth: true,
        htmlLabels: true,
        nodeSpacing: 26,
        rankSpacing: 34,
        padding: 16,
      },
    });

    mermaidInitialized = true;
  }

  return mermaid;
}

export default function MermaidDiagram({ chart, title, eyebrow, note }: MermaidDiagramProps) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const diagramId = useId().replace(/:/g, '-');

  useEffect(() => {
    let ignore = false;

    async function renderChart() {
      try {
        const mermaid = await getMermaid();
        const { svg: renderedSvg } = await mermaid.render(`relayforge-${diagramId}`, chart);
        if (!ignore) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (renderError) {
        if (!ignore) {
          setError(
            renderError instanceof Error
              ? renderError.message
              : 'Unable to render Mermaid diagram.',
          );
        }
      }
    }

    renderChart();

    return () => {
      ignore = true;
    };
  }, [chart, diagramId]);

  return (
    <figure className="doc-diagram-frame">
      <div className="doc-diagram-meta">
        <div>
          {eyebrow ? <p className="doc-diagram-eyebrow">{eyebrow}</p> : null}
          <p className="doc-diagram-caption">{title}</p>
        </div>
        <span className="doc-diagram-badge">
          <DocIcon name="spark" className="h-3.5 w-3.5" />
          Mermaid
        </span>
      </div>

      {error ? (
        <div className="doc-diagram-fallback">
          <p className="doc-diagram-error">Diagram rendering failed: {error}</p>
          <pre>{chart}</pre>
        </div>
      ) : (
        <div
          className="doc-mermaid"
          role="img"
          aria-label={title}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}

      {note ? <figcaption className="doc-diagram-footnote">{note}</figcaption> : null}
    </figure>
  );
}
