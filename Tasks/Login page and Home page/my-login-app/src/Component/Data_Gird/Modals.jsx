import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

export const AddRowModal = ({ show, onClose, columns, formData, setFormData, onAdd }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Add New Row</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        {columns.filter(c => c.id !== "id").map(col => (
          <Form.Group key={col.id} className="mb-3">
            <Form.Label>{col.name}</Form.Label>
            <Form.Control
              type="text"
              value={formData[col.id] || ""}
              onChange={e => setFormData({ ...formData, [col.id]: e.target.value })}
            />
          </Form.Group>
        ))}
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant="primary" onClick={onAdd}>Add</Button>
    </Modal.Footer>
  </Modal>
);

export const EditRowModal = ({ show, onClose, columns, formData, setFormData, onEdit }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Edit Row</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        {columns.filter(c => c.id !== "id").map(col => (
          <Form.Group key={col.id} className="mb-3">
            <Form.Label>{col.name}</Form.Label>
            <Form.Control
              type="text"
              value={formData[col.id] || ""}
              onChange={e => setFormData({ ...formData, [col.id]: e.target.value })}
            />
          </Form.Group>
        ))}
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant="primary" onClick={onEdit}>Save Changes</Button>
    </Modal.Footer>
  </Modal>
);

export const AddColumnModal = ({ show, onClose, newColumnName, setNewColumnName, onAdd }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Add New Column</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form.Group>
        <Form.Label>Column Name</Form.Label>
        <Form.Control
          type="text"
          value={newColumnName}
          onChange={e => setNewColumnName(e.target.value)}
          placeholder="Enter column name"
        />
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant="primary" onClick={onAdd}>Add Column</Button>
    </Modal.Footer>
  </Modal>
);
