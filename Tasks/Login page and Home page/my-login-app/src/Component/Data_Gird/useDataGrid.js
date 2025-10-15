import { useState, useEffect } from "react";

export const useDataGrid = () => {
  const [columns, setColumns] = useState([
    { id: "id", name: "ID", width: 100 },
    { id: "name", name: "Name", width: 200 },
    { id: "email", name: "Email", width: 250 },
    { id: "role", name: "Role", width: 150 },
  ]);

  const [data, setData] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Developer" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Designer" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Manager" },
  ]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [newColumnName, setNewColumnName] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [resizingColumn, setResizingColumn] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [searchFilters, setSearchFilters] = useState({});

  const getFilteredData = () => {
    let filtered = [...data];
    Object.keys(searchFilters).forEach((columnId) => {
      const term = (searchFilters[columnId] || "").toLowerCase();
      if (term) {
        filtered = filtered.filter((row) =>
          String(row[columnId] || "").toLowerCase().includes(term)
        );
      }
    });
    return filtered;
  };

  const getSortedData = () => {
    const filtered = getFilteredData();
    if (!sortConfig.key) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (columnId, direction) => {
    if (direction === "none") setSortConfig({ key: null, direction: null });
    else setSortConfig({ key: columnId, direction });
  };

  const handleSearchChange = (columnId, value) => {
    setSearchFilters({ ...searchFilters, [columnId]: value });
  };

  const handleAddRow = () => {
    const newRow = {};
    columns.forEach((c) => (newRow[c.id] = formData[c.id] || ""));
    newRow.id = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData((d) => [...d, newRow]);
    setFormData({});
  };

  const handleEditRow = () => {
    if (selectedRow === null) return;
    setData((d) => d.map((r) => (String(r.id) === selectedRow ? { ...r, ...formData } : r)));
    setFormData({});
    setSelectedRow(null);
  };

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    const columnId = newColumnName.toLowerCase().replace(/\s+/g, "_");
    const newCol = { id: columnId, name: newColumnName, width: 150 };
    setColumns((c) => [...c, newCol]);
    setData((rows) => rows.map((r) => ({ ...r, [columnId]: "" })));
    setNewColumnName("");
  };

  // Resize handlers
  const handleMouseDown = (e, columnId, currentWidth) => {
    e.preventDefault();
    document.body.style.userSelect = "none";
    setResizingColumn(columnId);
    setStartX(e.clientX);
    setStartWidth(currentWidth);
  };

  const handleMouseMove = (e) => {
    if (!resizingColumn) return;
    const diff = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + diff);
    setColumns((cols) => cols.map((col) => (col.id === resizingColumn ? { ...col, width: newWidth } : col)));
  };

  const handleMouseUp = () => {
    setResizingColumn(null);
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (resizingColumn) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [resizingColumn, startX, startWidth]);

  return {
    columns,
    data,
    selectedRow,
    formData,
    newColumnName,
    sortConfig,
    hoveredColumn,
    resizingColumn,
    searchFilters,
    setSelectedRow,
    setFormData,
    setNewColumnName,
    setHoveredColumn,
    getSortedData,
    handleSort,
    handleSearchChange,
    handleAddRow,
    handleEditRow,
    handleAddColumn,
    handleMouseDown,
  };
};
