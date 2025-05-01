import { useState, useEffect, useRef } from "react";

function CodeEditor({ code, onChange, language }) {
  const [internalCode, setInternalCode] = useState(code);
  const textareaRef = useRef(null);

  useEffect(() => {
    setInternalCode(code);
  }, [code]);

  const handleChange = (e) => {
    const newCode = e.target.value;
    setInternalCode(newCode);
    onChange(newCode);
  };

  return (
    <div className="code-editor-container">
      <textarea
        ref={textareaRef}
        value={internalCode}
        onChange={handleChange}
        className="code-editor"
        spellCheck="false"
      />
    </div>
  );
}

export default CodeEditor;
