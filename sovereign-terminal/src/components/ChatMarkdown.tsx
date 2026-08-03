import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useState, memo, useMemo } from "react";

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 rounded-md bg-muted/80 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
};

const markdownComponents = {
  code({ className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");
    if (match) {
      return (
        <div className="relative my-3 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground font-mono">
            {match[1]}
          </div>
          <CopyButton code={code} />
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            customStyle={{ margin: 0, borderRadius: 0, fontSize: "0.8rem" }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    }
    return (
      <code className="rounded bg-muted/60 px-1.5 py-0.5 text-xs font-mono text-foreground" {...props}>
        {children}
      </code>
    );
  },
  p({ children }: any) {
    return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
  },
  ul({ children }: any) {
    return <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>;
  },
  ol({ children }: any) {
    return <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>;
  },
  h1({ children }: any) {
    return <h1 className="mb-2 text-lg font-bold">{children}</h1>;
  },
  h2({ children }: any) {
    return <h2 className="mb-2 text-base font-bold">{children}</h2>;
  },
  h3({ children }: any) {
    return <h3 className="mb-1 text-sm font-bold">{children}</h3>;
  },
  blockquote({ children }: any) {
    return <blockquote className="border-l-2 border-primary/50 pl-3 italic text-muted-foreground my-2">{children}</blockquote>;
  },
  a({ href, children }: any) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">{children}</a>;
  },
  strong({ children }: any) {
    return <strong className="font-semibold">{children}</strong>;
  },
};

const ChatMarkdown = memo(({ content }: { content: string }) => (
  <ReactMarkdown components={markdownComponents}>
    {content}
  </ReactMarkdown>
));
ChatMarkdown.displayName = "ChatMarkdown";

export default ChatMarkdown;
