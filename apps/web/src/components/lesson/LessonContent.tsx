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
    <article className="prose prose-lg dark:prose-invert max-w-none">
      {metadata?.title && (
        <h1 className="text-4xl font-bold mb-2">{metadata.title}</h1>
      )}
      {metadata?.description && (
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
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
            <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-4 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}


