'use client';

import { ReactNode } from 'react';

interface MDXComponentsProps {
  children?: ReactNode;
  [key: string]: any;
}

// Custom components for MDX content
const components = {
  h1: ({ children, ...props }: MDXComponentsProps) => (
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: MDXComponentsProps) => (
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: MDXComponentsProps) => (
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-3" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: MDXComponentsProps) => (
    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: MDXComponentsProps) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: MDXComponentsProps) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: MDXComponentsProps) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),
  code: ({ children, ...props }: MDXComponentsProps) => (
    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-purple-600 dark:text-purple-400" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }: MDXComponentsProps) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }: MDXComponentsProps) => (
    <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-700 dark:text-gray-300 my-4" {...props}>
      {children}
    </blockquote>
  ),
  a: ({ children, ...props }: MDXComponentsProps) => (
    <a className="text-purple-600 dark:text-purple-400 hover:underline" {...props}>
      {children}
    </a>
  ),
  hr: () => <hr className="my-8 border-gray-300 dark:border-gray-700" />,
};

export function useMDXComponents() {
  return components;
}
