import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

function UserMaster() {
  // State for all users
  const [users, setUsers] = useState([
    { id: 1, username: 'John', profileName: 'Admin', email: 'john@example.com', group: 'Administrator', site: 'Chennai', approve: true },
  ]);

  // State for modal visibility & type
  const [show, setShow] = useState(false);
  const [actionType, setActionType] = useState('add');  //keeps track of Add or Edit.
  const [editingUserId, setEditingUserId] = useState(null); //stores the id of the user being edited. -> helps the handlesave to know which id

  // Form state
  const [formData, setFormData] = useState({  //formData stores all input field values in the modal. input name represent the formdata property
    username: '',
    profileName: '',
    email: '',
    group: '',
    site: '',
    approve: false
  });

  const handleClose = () => setShow(false);

  // Open modal for Add or Edit
  const handleShow = (type, user = null) => {   
    setActionType(type);

    if (type === 'edit' && user) {
      setEditingUserId(user.id);
      setFormData({ ...user }); // pre-fill data
    } else {
      setEditingUserId(null);
      setFormData({ username: '', profileName: '', email: '', group: '', site: '', approve: false });
    }

    setShow(true);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Save form
  const handleSave = () => {
    if (actionType === 'edit') {
      setUsers(users.map(u => u.id === editingUserId ? { ...formData, id: editingUserId } : u));
    } else {
      const newId = users.length ? users[users.length - 1].id + 1 : 1;
      setUsers([...users, { ...formData, id: newId }]);
    }
    handleClose();
  };

  return (
    <div>
      {/* Add/Edit Buttons */}
      <div className="d-flex flex gap-2 mb-3">
        <Button variant="primary" onClick={() => handleShow('add')}>Add User</Button>
        {users.length > 0 && (
          <Button variant="warning" onClick={() => handleShow('edit', users[0])}>Edit User</Button>
        )}
      </div>

      {/* Users Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Profile Name</th>
            <th>Email</th>
            <th>Group</th>
            <th>Site</th>
            <th>Approve</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.profileName}</td>
              <td>{user.email}</td>
              <td>{user.group}</td>
              <td>{user.site}</td>  
              <td style={{color:user.approve? "green" : "red"}}>{user.approve ? 'Active' : 'Unapproved'}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleShow('edit', user)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{actionType === 'add' ? 'Add User' : 'Edit User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Name <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="profileName"
                value={formData.profileName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />
              <span style={{ color: 'grey', fontSize: '12px' }}>
                Note: This mail is to recover the forgot password
              </span>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Group Name</Form.Label>
              <Form.Select name="group" value={formData.group} onChange={handleChange}>
                <option value="Administrator">Administrator</option>
                <option value="Analyst">Analyst</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Default Login Site</Form.Label>
              <Form.Select name="site" value={formData.site} onChange={handleChange}>
                <option value="">Select Site</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center gap-2">
              <label htmlFor="approve" className="mb-0">Approve</label>
              <Form.Check
                type="checkbox"
                id="approve"
                name="approve"
                checked={formData.approve}
                onChange={handleChange}
                className="m-0"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserMaster;
