import { Code, CopyBlock, dracula } from "react-code-blocks";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react"; // For managing TOC state

import { supportedLanguages } from "./supportedLangs";
import s from "./MDstyles.module.css";

const MarkdownPreview = ({ content }) => {
  const [toc, setToc] = useState([]);

  const notifyOnCopy = () => {
    toast.success("Copied to clipboard");
  };

  // Custom heading renderer to add IDs and build TOC
  const headingRenderer = ({ level, children }) => {
    const text = React.Children.toArray(children)
      .map(child => (typeof child === "string" ? child : child.props.children))
      .join("");
    const slug = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

    return React.createElement(`h${level}`, { id: slug }, children);
  };

  // Effect hook to update TOC after content is rendered
  useEffect(() => {
    // Extract headings from the content
    const headings = [];
    const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

    headingElements.forEach((heading) => {
      const slug = heading.id;
      const level = parseInt(heading.tagName[1]);
      const text = heading.textContent;
      headings.push({ level, text, slug });
    });

    setToc(headings);
  }, [content]); // Run the effect when content changes

  return (
    <div className={s.previewContainer}>
      {/* Table of Contents */}
      <nav className={s.toc}>
        <ul>
          {toc.map((item, index) => (
            <li key={index} style={{ marginLeft: `${(item.level - 1) * 20}px` }}>
              <a href={`#${item.slug}`}>{item.text}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Markdown Content */}
      <ReactMarkdown
        children={content}
        className={s.reactMarkdown}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children }) {
            const match = /language-(\w+)/.exec(className || "");
            let codeLang = "text";
            if (match) {
              codeLang = supportedLanguages.includes(match[1]) ? match[1] : "text";
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
          h1: headingRenderer,
          h2: headingRenderer,
          h3: headingRenderer,
          h4: headingRenderer,
          h5: headingRenderer,
          h6: headingRenderer,
        }}
      />
    </div>
  );
};

export default MarkdownPreview;
