import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Form,
  Modal,
  Table,
  Dropdown,
} from "react-bootstrap";
import { ChevronDown, Search } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const DynamicDataGrid = () => {
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
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
      const searchTerm = searchFilters[columnId]?.toLowerCase() || "";
      if (searchTerm) {
        filtered = filtered.filter((row) =>
          String(row[columnId] || "")
            .toLowerCase()
            .includes(searchTerm)
        );
      }
    });
    return filtered;
  };

  const getSortedData = () => {
    const filtered = getFilteredData();
    if (!sortConfig.key) return filtered;
    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const handleSort = (columnId, direction) => {
    if (direction === "none") {
      setSortConfig({ key: null, direction: null });
    } else {
      setSortConfig({ key: columnId, direction });
    }
  };

  const handleSearchChange = (columnId, value) => {
    setSearchFilters({
      ...searchFilters,
      [columnId]: value,
    });
  };

  const handleAddRow = () => {
    const newDataRow = {};
    columns.forEach((col) => {
      newDataRow[col.id] = formData[col.id] || "";
    });
    newDataRow.id =
      data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData([...data, newDataRow]);
    setShowAddModal(false);
    setFormData({});
  };

  const handleEditRow = () => {
  if (selectedRow === null) return;
  const updatedData = data.map(row =>
    String(row.id) === selectedRow ? { ...row, ...formData } : row
  );
  setData(updatedData);
  setShowEditModal(false);
  setFormData({});
  setSelectedRow(null);
};


  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    const columnId = newColumnName.toLowerCase().replace(/\s+/g, "_");
    const newColumn = { id: columnId, name: newColumnName, width: 150 };
    setColumns([...columns, newColumn]);
    setData(data.map((row) => ({ ...row, [columnId]: "" })));
    setNewColumnName("");
    setShowColumnModal(false);
  };

  const handleMouseDown = (e, columnId, currentWidth) => {
    e.preventDefault();
    // disable selection during resize
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    document.body.style.msUserSelect = "none";

    setResizingColumn(columnId);
    setStartX(e.clientX);
    setStartWidth(currentWidth);
  };

  const handleMouseMove = (e) => {
    if (!resizingColumn) return;
    const diff = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + diff);
    setColumns(
      columns.map((col) =>
        col.id === resizingColumn ? { ...col, width: newWidth } : col
      )
    );
  };

  const handleMouseUp = () => {
    setResizingColumn(null);
    // restore selection
    document.body.style.userSelect = "";
    document.body.style.webkitUserSelect = "";
    document.body.style.msUserSelect = "";
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

  const openEditModal = () => {
  if (selectedRow === null) {
    alert('Please select a row to edit');
    return;
  }
  const rowObj = data.find(r => String(r.id) === selectedRow);
  if (!rowObj) {
    alert('Selected row not found');
    return;
  }
  setFormData({ ...rowObj });
  setShowEditModal(true);
};


  const sortedData = getSortedData();

  console.log('selectedRow (current):', selectedRow);


  return (
    <Container fluid className="p-4 custom-grid">
      <style>{`
        /* core: prevent selection & tap highlight on header, handle and icon area */
        .custom-grid .grid-th,
        .custom-grid .grid-th * ,
        .custom-grid .resize-handle,
        .custom-grid .icon-box {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* ensure consistent grid lines: both headers and cells have right border */
        .custom-grid table thead th,
        .custom-grid table tbody td {
          border-right: 1px solid #dee2e6;
        }

        /* clear selection color inside the grid area */
        .custom-grid ::selection { background: transparent !important; color: inherit !important; }

        /* header basics */
        .custom-grid .grid-th { background: #f8f9fa; padding: 0; position: relative; }

        /* ICON BOX: sits at right edge, full height, draws divider with border-left.
           It starts slightly translated to the right and invisible (opacity 0),
           then slides in (translateX to 0) with opacity 1 on hover for smooth effect.
         */
        .custom-grid .icon-box {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;            /* align at very right edge */
          width: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-left: 1px solid #dee2e6; /* visible divider between columns */
          background: transparent;
          z-index: 2;
          box-sizing: border-box;
          transform: translateX(8px); /* start slightly to the right */
          opacity: 0;                /* hidden initially */
          transition: transform 180ms ease, opacity 180ms ease, background 120ms ease;
          pointer-events: none;      /* avoid catching events until visible */
        }

        /* On header hover, reveal icon smoothly and allow interaction */
        .custom-grid .grid-th:hover .icon-box,
        .custom-grid .grid-th.icon-hover .icon-box {
          transform: translateX(0);
          opacity: 1;
          background: #e9ecef;
          pointer-events: auto;
        }

        /* Hide bootstrap caret when using custom icon */
        .custom-grid .no-caret::after { display: none !important; }

        /* Resize handle sits at the very edge; make it slightly wider and overlapping the icon box so dragging is easy */
        .custom-grid .resize-handle {
          position: absolute;
          right: -6px; /* overlap so it's easy to grab */
          top: 0;
          bottom: 0;
          width: 12px; /* slightly larger hit area */
          cursor: col-resize;
          z-index: 3;
          background: transparent;
        }

        /* show blue highlight only while actively resizing */
        .custom-grid .resize-handle.resizing { background: rgba(13,110,253,0.25); }

        /* keyboard focus visible only for keyboard users */
        .custom-grid .grid-th:focus-visible,
        .custom-grid .icon-box:focus-visible,
        .custom-grid .resize-handle:focus-visible {
          outline: 2px solid rgba(13,110,253,0.35);
        }

        /* search input focus subtle grey */
        .custom-grid .form-control:focus { border-color: #adb5bd !important; box-shadow: 0 0 0 0.15rem rgba(173,181,189,0.25) !important; }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dynamic Data Grid</h2>
        <div>
          <Button
            variant="success"
            className="me-2"
            onClick={() => setShowAddModal(true)}
          >
            Add Row
          </Button>
          <Button variant="primary" className="me-2" onClick={openEditModal}>
            Edit Row
          </Button>
          <Button variant="info" onClick={() => setShowColumnModal(true)}>
            Add Column
          </Button>
        </div>
      </div>

      <div
        style={{ width: "65%", overflowX: "auto", border: "1px solid #dee2e6" }}
      >
        <Table bordered style={{ marginBottom: 0, userSelect: "none" }}>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.id}
                  className="grid-th"
                  style={{
                    width: col.width,
                    minWidth: col.width,
                    // don't set border-right here (CSS above handles it for headers/cells)
                    borderRight: "none",
                  }}
                  onMouseEnter={() => setHoveredColumn(col.id)}
                  onMouseLeave={() => setHoveredColumn(null)}
                  onDoubleClick={(e) => e.preventDefault()}
                >
                  <div
                    style={{
                      padding: "12px 8px",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ flex: 1 }}>{col.name}</span>
                  </div>

                  {/* Icon box: full height, positioned at right edge and draws divider */}
                  <div
                    className="icon-box"
                    aria-hidden={hoveredColumn === col.id ? "false" : "true"}
                    style={{
                      /* pointer-events controlled by CSS; we only set visibility via hoveredColumn state */
                      transform:
                        hoveredColumn === col.id
                          ? "translateX(0)"
                          : "translateX(8px)",
                      opacity: hoveredColumn === col.id ? 1 : 0,
                    }}
                  >
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        variant="link"
                        size="sm"
                        className="p-0 no-caret"
                        style={{
                          border: "none",
                          boxShadow: "none",
                          color: "#495057",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ChevronDown size={16} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleSort(col.id, "asc")}
                        >
                          Sort Ascending
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleSort(col.id, "desc")}
                        >
                          Sort Descending
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleSort(col.id, "none")}
                        >
                          Remove Sort
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  {/* Resize handle: placed slightly outside so user can drag, preserving icon clickable area */}
                  {idx < columns.length - 1 && (
                    <div
                      className={`resize-handle ${
                        resizingColumn === col.id ? "resizing" : ""
                      }`}
                      draggable={false}
                      tabIndex={-1}
                      onMouseDown={(e) => handleMouseDown(e, col.id, col.width)}
                      onDoubleClick={(e) => e.preventDefault()}
                    />
                  )}
                </th>
              ))}
            </tr>

            <tr>
              {columns.map((col) => (
                <th
                  key={`search-${col.id}`}
                  style={{
                    width: col.width,
                    minWidth: col.width,
                    padding: "8px",
                    backgroundColor: "white",
                    // border-right kept by global rule
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder={`Search ${col.name}`}
                      value={searchFilters[col.id] || ""}
                      onChange={(e) =>
                        handleSearchChange(col.id, e.target.value)
                      }
                      style={{ paddingLeft: "30px" }}
                    />
                    <Search
                      size={14}
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6c757d",
                      }}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedData.map((row) => {
              const rowIdStr = String(row.id); // normalize to string
              return (
                <tr
                  key={row.id}
                  onClick={() => {
                    setSelectedRow(rowIdStr);
                    // debug: uncomment to verify selection in console
                    // console.log('selectedRow set to', rowIdStr);
                  }}
                  className={selectedRow === rowIdStr ? "selected-row" : ""}
                  style={{ cursor: "pointer" }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      style={{
                        width: col.width,
                        minWidth: col.width,
                        borderRight: "1px solid #dee2e6",
                      }}
                    >
                      {row[col.id]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Add Row Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Row</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {columns
              .filter((col) => col.id !== "id")
              .map((col) => (
                <Form.Group key={col.id} className="mb-3">
                  <Form.Label>{col.name}</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData[col.id] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [col.id]: e.target.value })
                    }
                  />
                </Form.Group>
              ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddRow}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Row Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Row</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {columns
              .filter((col) => col.id !== "id")
              .map((col) => (
                <Form.Group key={col.id} className="mb-3">
                  <Form.Label>{col.name}</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData[col.id] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [col.id]: e.target.value })
                    }
                  />
                </Form.Group>
              ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditRow}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Column Modal */}
      <Modal show={showColumnModal} onHide={() => setShowColumnModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Column</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Column Name</Form.Label>
            <Form.Control
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Enter column name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowColumnModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddColumn}>
            Add Column
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DynamicDataGrid;
