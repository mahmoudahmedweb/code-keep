import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";

const languages = [
  "JavaScript",
  "HTML",
  "CSS",
  "Python",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Swift",
  "TypeScript",
  "Go",
  "Rust",
  "Shell",
  "SQL",
  "JSON",
  "Markdown",
];

function SnippetForm({ addSnippet, updateSnippet, editingSnippet, onCancel }) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (editingSnippet) {
      setTitle(editingSnippet.title);
      setCode(editingSnippet.code);
      setLanguage(editingSnippet.language);
      setTags(editingSnippet.tags);
    } else {
      resetForm();
    }
  }, [editingSnippet]);

  const resetForm = () => {
    setTitle("");
    setCode("");
    setLanguage("JavaScript");
    setTags([]);
    setNewTag("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const snippetData = {
      id: editingSnippet ? editingSnippet.id : Date.now().toString(),
      title,
      code,
      language,
      tags,
      createdAt: editingSnippet
        ? editingSnippet.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingSnippet) {
      updateSnippet(snippetData);
    } else {
      addSnippet(snippetData);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="form-modal">
      <div className="form-content">
        <h2>{editingSnippet ? "Edit Snippet" : "New Snippet"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Code</label>
            <CodeEditor code={code} onChange={setCode} language={language} />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <div className="tags-input">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Add a tag and press Enter"
              />
              <button type="button" onClick={addTag} className="add-tag-btn">
                Add
              </button>
            </div>
            <div className="tags-list">
              {tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="remove-tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editingSnippet ? "Update" : "Save"} Snippet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SnippetForm;
