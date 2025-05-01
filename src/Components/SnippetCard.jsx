import { useState } from "react";
import SyntaxHighlighter from "./SyntaxHighlighter";
import { FaTrash, FaCopy, FaEdit } from "react-icons/fa";

function SnippetCard({
  snippet,
  onEdit,
  onDelete,
  isExpanded,
  onToggleExpand,
}) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(snippet.code)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(console.error);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(snippet);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(snippet.id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article className={`snippet-card ${isExpanded ? "expanded" : ""}`}>
      <header
        className="snippet-header"
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
      >
        <div className="header-content">
          <h3 className="snippet-title">{snippet.title}</h3>
          <div className="meta-info">
            <span
              className={`language-badge ${snippet.language.toLowerCase()}`}
            >
              {snippet.language}
            </span>
            <time className="last-updated" dateTime={snippet.updatedAt}>
              {formatDate(snippet.updatedAt)}
            </time>
          </div>
        </div>
      </header>

      {isExpanded && (
        <div className="card-body">
          {snippet.tags.length > 0 && (
            <div className="tags-section">
              <div className="tags-list">
                {snippet.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="code-preview">
            <SyntaxHighlighter
              code={snippet.code}
              language={snippet.language}
            />
          </div>

          <footer className="card-actions">
            <button
              onClick={copyToClipboard}
              className="btn copy-btn"
              aria-label="Copy code"
            >
              <FaCopy className="btn-icon" />
              <span>{isCopied ? "Copied!" : "Copy"}</span>
            </button>
            <button
              onClick={handleEdit}
              className="btn edit-btn"
              aria-label="Edit snippet"
            >
              <FaEdit className="btn-icon" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="btn delete-btn"
              aria-label="Delete snippet"
            >
              <FaTrash className="btn-icon" />
            </button>
          </footer>
        </div>
      )}
    </article>
  );
}

export default SnippetCard;
