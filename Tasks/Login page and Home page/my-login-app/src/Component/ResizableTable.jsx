import { useState, useMemo } from 'react';
import 'react-data-grid/lib/styles.css';
import { DataGrid } from 'react-data-grid';
import HeaderWithDropdown from './HeaderWithDropdown';

const initialRows = [
  { id: 1, username: 'Kirubhakaran', approve: true },
  { id: 2, username: 'Arun', approve: false },
  { id: 3, username: 'Divya', approve: true }
];

function ResizableTable() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return initialRows;
    return [...initialRows].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortConfig]);

  const createColumn = (key, name) => ({
    key,
    name,
    resizable: true,
    headerRenderer: () => (
      <HeaderWithDropdown
        title={name}
        onSort={(direction) => setSortConfig({ key, direction })}
      />
    )
  });

  const columns = [
    createColumn('id', 'ID'),
    createColumn('username', 'User Name'),
    createColumn('approve', 'Status')
  ];

  return <DataGrid columns={columns} rows={sortedRows} />;
}

export default ResizableTable;