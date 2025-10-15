import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

function HeaderWithDropdown({ title, onSort }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{title}</span>
      <Dropdown show={open} onToggle={() => setOpen(!open)} onSelect={(key) => onSort(key)}>
        <Dropdown.Toggle
          size="sm"
          variant="secondary"
          onClick={(e) => e.stopPropagation()}
        >
          ▼
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="asc">Sort Asc</Dropdown.Item>
          <Dropdown.Item eventKey="desc">Sort Desc</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default HeaderWithDropdown;