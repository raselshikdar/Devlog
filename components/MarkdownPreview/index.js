import { Code, CopyBlock, dracula } from "react-code-blocks";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { supportedLanguages } from "./supportedLangs";
import s from "./MDstyles.module.css";

const MarkdownPreview = ({ content }) => {
  const notifyOnCopy = () => {
    toast.success("copied to clipboard");
  };

  const headingRenderer = ({ level, children }) => {
    const text = children[0]; // Assuming the heading text is the first child
    const slug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    return React.createElement(`h${level}`, { id: slug }, children);
  };

  return (
    <ReactMarkdown
      children={content}
      className={s.reactMarkdown}
      remarkPlugins={[remarkGfm]}
      components={{
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
        // Add the heading renderer here
        h1: headingRenderer,
        h2: headingRenderer,
        h3: headingRenderer,
        h4: headingRenderer,
        h5: headingRenderer,
        h6: headingRenderer,
      }}
    />
  );
};

export default MarkdownPreview;
