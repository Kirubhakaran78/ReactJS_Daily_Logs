// src/DataGrid.jsx
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Container, Table, Button, Form } from "react-bootstrap";
import { ChevronDown, Search } from "lucide-react";
import { AddRowModal, EditRowModal, AddColumnModal } from "./Modals";
import { useDataGrid } from "./useDataGrid";
import "./DataGrid.css";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * HeaderMenu
 * - Renders a simple menu portal anchored to a DOM rect (the chevron button).
 * - Props:
 *    anchorRect: DOMRect for positioning (button.getBoundingClientRect())
 *    onClose: function
 *    onSortAsc/Desc/None: handlers
 *    visible: boolean
 */
const HeaderMenu = ({ anchorRect, visible, onClose, onSortAsc, onSortDesc, onSortNone }) => {
  const menuRef = useRef(null);

  // position calculation: place menu below anchorRect, aligned to right edge of anchor
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchorRect) return;
    const calculate = () => {
      const menuWidth = 180; // assumed width of menu (we limit it via CSS)
      const spacing = 6;
      // prefer aligning right edges (so menu appears under the chevron)
      let left = anchorRect.right - menuWidth;
      if (left < 8) left = 8;
      let top = anchorRect.bottom + spacing;
      // if bottom would go off-screen, open above anchor
      const viewportHeight = window.innerHeight;
      if (top + 200 > viewportHeight) {
        top = anchorRect.top - 6 - 120; // open above (approx)
      }
      setPos({ top: Math.round(top), left: Math.round(left) });
    };

    calculate();
    // recalc on resize/scroll
    window.addEventListener("resize", calculate);
    window.addEventListener("scroll", calculate, true);
    return () => {
      window.removeEventListener("resize", calculate);
      window.removeEventListener("scroll", calculate, true);
    };
  }, [anchorRect]);

  useEffect(() => {
    // close on Esc or click outside
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) onClose();
    };
    if (visible) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onDocClick);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDocClick);
    };
  }, [visible, onClose]);

  if (!visible || !anchorRect) return null;

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      className="dg-portal-menu"
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: 180,
        background: "#fff",
        borderRadius: 6,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        zIndex: 2147483000, // extremely high so nothing covers it
        padding: "6px 0",
      }}
    >
      <button
        className="dg-portal-item"
        onClick={() => {
          onSortAsc();
          onClose();
        }}
        style={{
          display: "block",
          padding: "8px 12px",
          width: "100%",
          textAlign: "left",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        Sort Ascending
      </button>
      <button
        className="dg-portal-item"
        onClick={() => {
          onSortDesc();
          onClose();
        }}
        style={{
          display: "block",
          padding: "8px 12px",
          width: "100%",
          textAlign: "left",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        Sort Descending
      </button>
      <button
        className="dg-portal-item"
        onClick={() => {
          onSortNone();
          onClose();
        }}
        style={{
          display: "block",
          padding: "8px 12px",
          width: "100%",
          textAlign: "left",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        Remove Sort
      </button>
    </div>,
    document.body
  );
};

const DataGrid = () => {
  const {
    columns,
    data,
    selectedRow,
    formData,
    newColumnName,
    hoveredColumn,
    resizingColumn,
    setHoveredColumn,
    setSelectedRow,
    setFormData,
    setNewColumnName,
    getSortedData,
    handleSort,
    handleSearchChange,
    handleAddRow,
    handleEditRow,
    handleAddColumn,
    handleMouseDown,
  } = useDataGrid();

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddColumn, setShowAddColumn] = useState(false);

  // Header menu state
  const [activeHeader, setActiveHeader] = useState(null); // column id of open menu
  const [anchorRect, setAnchorRect] = useState(null);
  const chevronRefs = useRef({}); // store refs to chevrons

  const sortedData = getSortedData();

  // open header menu anchored to the chevron DOM rect
  const toggleHeaderMenu = (colId) => {
    if (activeHeader === colId) {
      setActiveHeader(null);
      setAnchorRect(null);
      return;
    }
    const ref = chevronRefs.current[colId];
    if (ref && ref.getBoundingClientRect) {
      setAnchorRect(ref.getBoundingClientRect());
    } else {
      setAnchorRect(null);
    }
    setActiveHeader(colId);
  };

  // when closing, clear activeHeader
  const closeHeaderMenu = () => {
    setActiveHeader(null);
    setAnchorRect(null);
  };

  const openEdit = () => {
    if (selectedRow === null) {
      alert("Please select a row to edit");
      return;
    }
    const row = data.find((r) => String(r.id) === selectedRow);
    if (row) {
      setFormData({ ...row });
      setShowEdit(true);
    } else {
      alert("Selected row not found");
    }
  };

  return (
    <Container fluid className="p-4 custom-grid">
      <h2 className="mb-3">Dynamic Data Grid</h2>

      <div className="mb-3">
        <Button
          className="me-2"
          variant="success"
          onClick={() => {
            setFormData({});
            setShowAdd(true);
          }}
        >
          Add Row
        </Button>

        <Button
          className="me-2"
          variant="primary"
          onClick={() => {
            openEdit();
          }}
        >
          Edit Row
        </Button>

        <Button
          variant="info"
          onClick={() => {
            setNewColumnName("");
            setShowAddColumn(true);
          }}
        >
          Add Column
        </Button>
      </div>

      <div style={{ width: "65%", overflowX: "auto", border: "1px solid #dee2e6" }}>
        <Table bordered className="table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.id}
                  className="grid-th"
                  style={{ width: col.width, minWidth: col.width }}
                  onMouseEnter={() => setHoveredColumn(col.id)}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  <div className="th-content" style={{ padding: "12px 8px" }}>
                    <span style={{ flex: 1 }}>{col.name}</span>
                  </div>

                  {/* icon area - a clickable chevron (we store its ref) */}
                  <div
                    className="icon-box"
                    style={{ opacity: hoveredColumn === col.id ? 1 : 0 }}
                    onClick={(e) => {
                      // stop row click bubbling when clicking the icon
                      e.stopPropagation();
                      toggleHeaderMenu(col.id);
                    }}
                  >
                    <button
                      ref={(el) => (chevronRefs.current[col.id] = el)}
                      aria-label={`Column ${col.name} menu`}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 4,
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        color: "#495057",
                      }}
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  {idx < columns.length - 1 && (
                    <div
                      className={`resize-handle ${resizingColumn === col.id ? "resizing" : ""}`}
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
                <th key={`search-${col.id}`} style={{ padding: "6px 8px", background: "#fff" }}>
                  <div className="search-wrapper">
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder={`Search ${col.name}`}
                      onChange={(e) => handleSearchChange(col.id, e.target.value)}
                      style={{ paddingLeft: "30px", height: "34px" }}
                    />
                    <Search size={14} className="search-icon" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedData.map((row) => (
              <tr
                key={row.id}
                onClick={() => setSelectedRow(String(row.id))}
                className={selectedRow === String(row.id) ? "selected-row" : ""}
                style={{ cursor: "pointer" }}
              >
                {columns.map((col) => (
                  <td key={col.id} style={{ width: col.width, padding: "10px 8px" }}>
                    <div className="cell-content">{row[col.id]}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Header menu portal (rendered into body) */}
      <HeaderMenu
        anchorRect={anchorRect}
        visible={Boolean(activeHeader)}
        onClose={closeHeaderMenu}
        onSortAsc={() => handleSort(activeHeader, "asc")}
        onSortDesc={() => handleSort(activeHeader, "desc")}
        onSortNone={() => handleSort(activeHeader, "none")}
      />

      {/* Modals */}
      <AddRowModal
        show={showAdd}
        onClose={() => setShowAdd(false)}
        columns={columns}
        formData={formData}
        setFormData={setFormData}
        onAdd={() => {
          handleAddRow();
          setShowAdd(false);
        }}
      />

      <EditRowModal
        show={showEdit}
        onClose={() => setShowEdit(false)}
        columns={columns}
        formData={formData}
        setFormData={setFormData}
        onEdit={() => {
          handleEditRow();
          setShowEdit(false);
        }}
      />

      <AddColumnModal
        show={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        newColumnName={newColumnName}
        setNewColumnName={setNewColumnName}
        onAdd={() => {
          handleAddColumn();
          setShowAddColumn(false);
        }}
      />
    </Container>
  );
};

export default DataGrid;
