'use client';

import ReactMarkdown from 'react-markdown';
import CodeBlock from '@/components/content/CodeBlock';

interface LessonContentProps {
  content: string;
  metadata?: {
    title?: string;
    description?: string;
  };
}

export default function LessonContent({ content, metadata }: LessonContentProps) {
  return (
    <article className="text-slate-300">
      {metadata?.title && (
        <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
          {metadata.title}
        </h1>
      )}
      {metadata?.description && (
        <p className="text-lg leading-relaxed text-slate-300 mb-8 border-l-4 border-indigo-500 pl-4 bg-indigo-900/10 py-3 rounded-r-lg">
          {metadata.description}
        </p>
      )}

      <ReactMarkdown
        components={{
          code: ({ node, inline, className, children, ...props }: any) => {
            const value = String(children).replace(/\n$/, '');
            return (
              <CodeBlock inline={inline} className={className}>
                {value}
              </CodeBlock>
            );
          },
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold text-white tracking-tight mt-8 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold text-white mt-8 mb-4" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-bold text-white mt-6 mb-3" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-lg leading-relaxed text-slate-300 mb-6" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-6 space-y-2 text-slate-300 ml-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-6 space-y-2 text-slate-300 ml-4" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-accent-gold bg-amber-500/10 pl-5 py-3 pr-4 my-6 rounded-r-lg text-amber-100 flex gap-3 items-start"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a className="text-indigo-400 hover:text-indigo-300 underline transition-colors" {...props} />
          ),
          hr: () => <hr className="my-8 border-navy-700" />,
          strong: ({ node, ...props }) => (
            <strong className="text-white font-semibold" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
