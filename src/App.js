import { useState, useEffect } from "react";
import SnippetForm from "./Components/SnippetForm.jsx";
import SnippetList from "./Components/SnippetList.jsx";
import "./styles/theme.css";
import "./styles/syntax-theme.css";

function App() {
  // Initialize state directly from localStorage
  const [snippets, setSnippets] = useState(() => {
    try {
      const savedSnippets = localStorage.getItem("codeKeepSnippets");
      return savedSnippets ? JSON.parse(savedSnippets) : [];
    } catch (error) {
      console.error("Failed to read from localStorage:", error);
      return [];
    }
  });

  const [editingSnippet, setEditingSnippet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Save snippets to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("codeKeepSnippets", JSON.stringify(snippets));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [snippets]);

  const addSnippet = (newSnippet) => {
    setSnippets((prevSnippets) => [
      ...prevSnippets,
      {
        ...newSnippet,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    setIsFormOpen(false);
  };

  const updateSnippet = (updatedSnippet) => {
    setSnippets((prevSnippets) =>
      prevSnippets.map((snippet) =>
        snippet.id === updatedSnippet.id
          ? { ...updatedSnippet, updatedAt: new Date().toISOString() }
          : snippet
      )
    );
    setEditingSnippet(null);
    setIsFormOpen(false);
  };

  const deleteSnippet = (id) => {
    setSnippets((prevSnippets) =>
      prevSnippets.filter((snippet) => snippet.id !== id)
    );
  };

  const handleEdit = (snippet) => {
    setEditingSnippet(snippet);
    setIsFormOpen(true);
  };

  const filteredSnippets = snippets.filter((snippet) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      snippet.title.toLowerCase().includes(searchLower) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const sortedSnippets = [...filteredSnippets].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  const exportSnippets = () => {
    const dataStr = JSON.stringify(snippets, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", "codekeep-snippets.json");
    linkElement.click();
  };

  const importSnippets = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const importedSnippets = JSON.parse(e.target.result);
        if (Array.isArray(importedSnippets)) {
          // Add new IDs and timestamps to imported snippets
          const processedSnippets = importedSnippets.map((snippet) => ({
            ...snippet,
            id: snippet.id || Date.now().toString(),
            createdAt: snippet.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
          setSnippets(processedSnippets);
        }
      } catch (error) {
        alert("Invalid file format. Please import a valid JSON file.");
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Code Keep</h1>
        <div className="controls">
          <div className="search-sort">
            <input
              type="text"
              placeholder="Search snippets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
          <button
            onClick={() => {
              setEditingSnippet(null);
              setIsFormOpen(true);
            }}
            className="add-btn"
          >
            + New Snippet
          </button>
          <div className="import-export">
            <button onClick={exportSnippets} className="export-btn">
              Export
            </button>
            <label htmlFor="import-file" className="import-btn">
              Import
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={importSnippets}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
      </header>

      <main className="app-main">
        {isFormOpen && (
          <SnippetForm
            addSnippet={addSnippet}
            updateSnippet={updateSnippet}
            editingSnippet={editingSnippet}
            onCancel={() => setIsFormOpen(false)}
          />
        )}
        <SnippetList
          snippets={sortedSnippets}
          onEdit={handleEdit}
          onDelete={deleteSnippet}
        />
      </main>
    </div>
  );
}

export default App;
