# JQWidgets Migration Utilities

This directory contains utilities to help migrate jQuery/jQWidgets controls to React components.

## Files

- `jqwidgetsMigration.js` - Main migration utilities file

## Usage

### Import the utilities

```javascript
import { 
  createComboboxControl, 
  createGridControl, 
  useCombobox, 
  useGrid 
} from './utils/jqwidgetsMigration';
```

### Using the Direct Functions

```javascript
// Create a combobox
const comboboxElement = $('#myCombobox');
createComboboxControl({
  thisObjID: comboboxElement,
  displayMember: 'name',
  valueMember: 'id',
  width: 200,
  height: 30,
  placeHolder: 'Select an option'
});
```

### Using React Hooks (Recommended)

```javascript
import React from 'react';
import { useCombobox, useGrid } from './utils/jqwidgetsMigration';

const MyComponent = () => {
  const comboboxRef = useCombobox({
    displayMember: 'name',
    valueMember: 'id',
    width: 200,
    height: 30,
    placeHolder: 'Select an option'
  });

  const gridRef = useGrid({
    clsColumnDetails: [
      { text: 'Name', datafield: 'name', width: 200 },
      { text: 'Age', datafield: 'age', width: 100 }
    ],
    width: 400,
    height: 300
  });

  return (
    <div>
      <div ref={comboboxRef}></div>
      <div ref={gridRef}></div>
    </div>
  );
};
```

## Available Controls

### 1. Combobox
- **Function**: `createComboboxControl`
- **Hook**: `useCombobox`
- **Features**: Auto-complete, search, placeholder

### 2. Grid
- **Function**: `createGridControl`
- **Hook**: `useGrid`
- **Features**: Sorting, filtering, resizing, tooltips

### 3. Tree
- **Function**: `createTreeControl`
- **Hook**: `useTree`
- **Features**: Hierarchical data, expand/collapse

### 4. Listbox
- **Function**: `createListboxControl`
- **Hook**: `useListbox`
- **Features**: Multi-select, filtering, search

### 5. DatePicker
- **Function**: `createDatePickerControl`
- **Hook**: `useDatePicker`
- **Features**: Date/time input with calendar

### 6. Dropdown
- **Function**: `createDropDownControl`
- **Hook**: `useDropDown`
- **Features**: Single select dropdown

## Migration Steps

1. **Install Dependencies**: Ensure jQuery and jQWidgets are available
2. **Import Utilities**: Import the required functions/hooks
3. **Replace Direct Calls**: Replace `JS_createComboboxControl()` with `createComboboxControl()`
4. **Use React Hooks**: For new components, use the provided hooks
5. **Update References**: Change `thisObjID` to use React refs

## Example Migration

### Before (jQuery)
```javascript
JS_createComboboxControl({
  thisObjID: $('#myCombobox'),
  displayMember: 'name',
  valueMember: 'id',
  width: 200,
  height: 30
});
```

### After (React)
```javascript
const comboboxRef = useCombobox({
  displayMember: 'name',
  valueMember: 'id',
  width: 200,
  height: 30
});

// In JSX
<div ref={comboboxRef}></div>
```

## Notes

- All original functionality is preserved
- React hooks handle lifecycle management automatically
- Direct functions can be used for non-React contexts
- Ensure jQuery and jQWidgets are loaded before using these utilities
