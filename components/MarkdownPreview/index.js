import { Code, CopyBlock, dracula } from "react-code-blocks";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supportedLanguages } from "./supportedLangs";
import s from "./MDstyles.module.css";

// Slug generation function
const generateSlug = (text) => {
  if (!text) return "heading"; // Fallback for empty text
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

// Flatten children for complex headings
const flattenChildren = (children) => {
  if (typeof children === "string") return children;
  return children.reduce((acc, child) => {
    if (typeof child === "string") return acc + child;
    return acc + flattenChildren(child.props.children);
  }, "");
};

// MarkdownPreview Component
const MarkdownPreview = ({ content }) => {
  const notifyOnCopy = () => {
    toast.success("Copied to clipboard");
  };

  return (
    <ReactMarkdown
      children={content}
      className={s.reactMarkdown}
      remarkPlugins={[remarkGfm]}
      components={{
        // Add heading anchors here
        h1: ({ children }) => <h1 id={generateSlug(flattenChildren(children))}>{children}</h1>,
        h2: ({ children }) => <h2 id={generateSlug(flattenChildren(children))}>{children}</h2>,
        h3: ({ children }) => <h3 id={generateSlug(flattenChildren(children))}>{children}</h3>,
        h4: ({ children }) => <h4 id={generateSlug(flattenChildren(children))}>{children}</h4>,
        h5: ({ children }) => <h5 id={generateSlug(flattenChildren(children))}>{children}</h5>,
        h6: ({ children }) => <h6 id={generateSlug(flattenChildren(children))}>{children}</h6>,
        code({ inline, className, children }) {
          const match = /language-(\w+)/.exec(className || "");
          let codeLang = "text";
          if (match) {
            codeLang = supportedLanguages.includes(match[1])
              ? match[1]
              : "text";
          }
          return inline && !match ? (
            <Code text={children[0]} language={codeLang} theme={dracula} />
          ) : (
            <CopyBlock
              text={children[0]}
              showLineNumbers
              theme={dracula}
              codeBlock
              onCopy={notifyOnCopy}
              language={codeLang}
            />
          );
        },
      }}
    />
  );
};

export default MarkdownPreview;
