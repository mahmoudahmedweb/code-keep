import { useEffect, useRef } from "react";

function SyntaxHighlighter({ code, language }) {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      const codeElement = codeRef.current;
      codeElement.innerHTML = codeElement.textContent
        .replace(
          /(\/\/.*|\/\*[\s\S]*?\*\/)/g,
          '<span class="comment">$1</span>'
        ) // Comments
        .replace(
          /(\b(?:function|if|else|for|while|return|const|let|var|class)\b)/g,
          '<span class="keyword">$1</span>'
        ) // Keywords
        .replace(/(["'].*?["'])/g, '<span class="string">$1</span>') // Strings
        .replace(/(\b\d+\b)/g, '<span class="number">$1</span>') // Numbers
        .replace(
          /(\b(?:true|false|null|undefined)\b)/g,
          '<span class="constant">$1</span>'
        );
    }
  }, [code, language]);

  return (
    <pre className={`syntax-highlight ${language.toLowerCase()}`}>
      <code ref={codeRef}>{code}</code>
    </pre>
  );
}

export default SyntaxHighlighter;
