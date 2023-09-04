import React, { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import htmlReactParser from "html-react-parser";

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  children,
  className,
}) => {
  // Use html-react-parser to parse HTML and convert it to React elements
  const parsedContent = htmlReactParser(children);

  // Define custom rendering functions for specific elements
  const renderers = {
    // Customize the rendering of <p> elements
    p: (props: { children: ReactNode }) => (
      <p className="my-2 flex flex-row gap-2">{props.children}</p>
    ),

    // Customize the rendering of <ul> elements
    ul: (props: { children: ReactNode }) => (
      <ul className="my-2">{props.children}</ul>
    ),

    // Customize the rendering of <li> elements
    li: (props: { children: ReactNode }) => (
      <li className="my-1">{props.children}</li>
    ),

    // Customize the rendering of heading elements with alignment
    heading: (props: { level: number; children: ReactNode }) => {
      // Determine the alignment based on the level and align attribute
      const align = props.level === 1 ? "text-left" : "text-center"; // Default to center align for non-h1 headings
      const classes = `my-4 text-${
        props.level === 1 ? "2xl" : "xl"
      } font-bold ${align}`;

      return React.createElement(
        `h${props.level}`,
        { className: classes },
        props.children
      );
    },
  };

  // Process parsed content to generate an array of elements
  const renderedParts = React.Children.toArray(parsedContent).map(
    (node: ReactNode, index: number) => {
      if (React.isValidElement(node)) {
        // Add the className to HTML tags as a prop
        return React.cloneElement(node, { key: index, className });
      } else if (typeof node === "string") {
        // Render Markdown content using ReactMarkdown with the className
        return (
          <ReactMarkdown
            key={index}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            remarkRehypeOptions={{ allowDangerousHtml: true }}
            className={className}
            components={renderers}
          >
            {node}
          </ReactMarkdown>
        );
      }
      return null;
    }
  );

  return <>{renderedParts}</>;
};

export default MarkdownRenderer;
