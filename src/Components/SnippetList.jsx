import { useState } from "react";
import SnippetCard from "./SnippetCard";

function SnippetList({ snippets, onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  const handleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="snippet-list">
      {snippets.length === 0 ? (
        <div className="empty-state">
          <p>No snippets found. Create one to get started!</p>
        </div>
      ) : (
        snippets.map((snippet) => (
          <SnippetCard
            key={snippet.id}
            snippet={snippet}
            onEdit={onEdit}
            onDelete={onDelete}
            isExpanded={expandedId === snippet.id}
            onToggleExpand={() => handleExpand(snippet.id)}
          />
        ))
      )}
    </div>
  );
}

export default SnippetList;
