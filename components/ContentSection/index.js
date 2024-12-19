import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

const CodeBlock = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={dracula}
        language={match[1]}
        PreTag="div"
        {...props}
        className="bg-gray-900 text-white rounded-lg p-4 my-4" // Tailwind for syntax highlight block
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code
        className={`text-sm text-gray-800 bg-gray-200 p-1 rounded-md ${className}`} // Tailwind for inline code
        {...props}
      >
        {children}
      </code>
    );
  },
};

const ContentSection = ({ content }) => {
  return (
    <ReactMarkdown components={CodeBlock} className="markdown-class prose dark:prose-invert">
      {content}
    </ReactMarkdown>
  );
};

export default ContentSection;
