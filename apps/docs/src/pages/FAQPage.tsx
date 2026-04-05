const faqs = [
  {
    question: 'Why move the detailed server docs into the client repo?',
    answer:
      'Because the client repo already owns the public docs site and is the better place to publish a unified platform narrative. The server repo should stay runtime-focused.',
  },
  {
    question: 'Does the backend still build independently?',
    answer:
      'Yes. The repo split remains intact. The only thing that moved is the long-form narrative documentation, not the server build or deployment assets.',
  },
  {
    question: 'What is the boundary between the repos?',
    answer:
      'Explicit runtime URLs. The client surfaces consume API, realtime, media, and LiveKit endpoints instead of relying on a sibling checkout.',
  },
  {
    question: 'Where should release automation live?',
    answer:
      'Client release workflows live in relay-forge. Backend binary and container release workflows live in relay-forge-server.',
  },
  {
    question: 'Why change the license away from AGPL?',
    answer:
      'The relicensing decision here is to optimize adoption and contribution flexibility while keeping a clear patent grant, which Apache-2.0 provides.',
  },
];

export default function FAQPage() {
  return (
    <section className="doc-section">
      <p className="doc-kicker">FAQ</p>
      <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
        Common questions after the docs consolidation.
      </h1>
      <div className="doc-card-grid">
        {faqs.map((faq) => (
          <article key={faq.question} className="doc-card">
            <h2 className="doc-card-title">{faq.question}</h2>
            <p className="doc-card-copy">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
