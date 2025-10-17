// JQWidgets Migration Utilities for React
// This file provides React-compatible versions of the original jQuery/jQWidgets control creation functions

import React, { useEffect, useRef } from 'react';

// Check if jQuery is available
const checkJQuery = () => {
  if (typeof window !== 'undefined' && window.$) {
    return window.$;
  }
  throw new Error('jQuery is not loaded. Please ensure jQuery is included before using jQWidgets utilities.');
};

// Combobox Creation for React
export const createComboboxControl = (objCtrlDetails) => {
  const $ = checkJQuery();
  
  const {
    thisObjID,
    displayMember,
    valueMember,
    width,
    height,
    placeHolder = "",
    property
  } = objCtrlDetails;

  const localDataRecords = [];

  const source = {
    datatype: "json",
    localdata: localDataRecords
  };

  const dataAdapter = new $.jqx.dataAdapter(source);
  
  thisObjID.jqxComboBox({
    source: dataAdapter,
    displayMember: displayMember,
    placeHolder: placeHolder,
    autoComplete: true,
    valueMember: valueMember,
    width: width,
    height: height,
    searchMode: 'containsignorecase'
  });

  thisObjID.addClass("empty-combo-check");
  
  if (property) {
    thisObjID.jqxComboBox(property);
  }
};

// Grid Creation for React
export const createGridControl = (objCtrlDetails) => {
  const $ = checkJQuery();
  
  const {
    thisObjID,
    clsColumnDetails,
    height,
    width,
    objControlProperty
  } = objCtrlDetails;

  const localDataRecords = [];
        
  const source = {
    datatype: "json",
    localdata: localDataRecords
  };
  
  const dataAdapter = new $.jqx.dataAdapter(source);
     
  thisObjID.jqxGrid({
    width: width,
    height: height,
    source: dataAdapter,
    enabletooltips: true,
    autoshowloadelement: false,
    columnsresize: true,
    showfilterrow: true,
    columnsheight: 40,
    sortable: true, 
    filterable: true,
    theme: 'gridqualis',
    columns: clsColumnDetails,
    rowsheight: 40,
    enablehover: true,
    selectionmode: 'singlerow',
    showstatusbar: false,
    scrollmode: 'default',
    scrollbarsize: 17,
    enablebrowserselection: false,
    virtualmode: false,
    pagesize: 50,
    pagerheight: 0
  });
  
  if (objControlProperty) {
    thisObjID.jqxGrid(objControlProperty);
  }
};

// Tree Creation for React
export const createTreeControl = (objCtrlDetails) => {
  const $ = checkJQuery();
  
  const {
    thisObjID,
    height,
    width,
    objControlProperty
  } = objCtrlDetails;

  const localDataRecords = [];
    
  const source = {
    datatype: "json",
    localdata: localDataRecords
  };
  
  const dataAdapter = new $.jqx.dataAdapter(source);
  dataAdapter.dataBind();
  
  const records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);
  
  thisObjID.jqxTree({ 
    source: records, 
    width: width, 
    height: height 
  });
  
  if (objControlProperty) {
    thisObjID.jqxTree(objControlProperty);
  }
};

// Listbox Creation for React
export const createListboxControl = (objCtrlDetails) => {
  const $ = checkJQuery();
  
  const {
    thisObjID,
    displayMember,
    valueMember,
    width,
    height,
    property
  } = objCtrlDetails;

  const localDataRecords = [];
  
  const source = {
    datatype: "json",
    localdata: localDataRecords
  };
  
  const dataAdapter = new $.jqx.dataAdapter(source);
  
  thisObjID.jqxListBox({
    source: dataAdapter,
    displayMember: displayMember,
    valueMember: valueMember,
    width: width,
    height: height,
    filterable: true,
    searchMode: 'containsignorecase'
  });
  
  if (property) {
    thisObjID.jqxListBox(property);
  }
};

// Datepicker Creation for React
export const createDatePickerControl = (objCtrlDateDetails) => {
  const $ = checkJQuery();
  
  const {
    thisObjID,
    property = {}
  } = objCtrlDateDetails;

  const extendedProperty = {
    ...property,
    width: '100%',
    height: '36px'
  };
  
  thisObjID.jqxDateTimeInput(extendedProperty);
};

// Dropdown Creation for React
export const createDropDownControl = (objCtrlDetails) => {
  const $ = checkJQuery();
  
  const {
    thisObjID,
    displayMember,
    valueMember,
    width,
    height,
    placeHolder = "",
    property
  } = objCtrlDetails;

  const localDataRecords = [];

  const source = {
    datatype: "json",
    localdata: localDataRecords
  };

  const dataAdapter = new $.jqx.dataAdapter(source);
  
  thisObjID.jqxDropDownList({
    source: dataAdapter,
    displayMember: displayMember, 
    valueMember: valueMember,
    width: width,
    height: height
  });

  thisObjID.addClass("empty-combo-check");
  
  if (property) {
    thisObjID.jqxDropDownList(property);
  }
};

// React Hook for Combobox
export const useCombobox = (objCtrlDetails) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      try {
        const $ = checkJQuery();
        createComboboxControl({
          ...objCtrlDetails,
          thisObjID: $(elementRef.current)
        });
      } catch (error) {
        console.error('Error creating combobox:', error);
      }
    }
  }, []);

  return elementRef;
};

// React Hook for Grid
export const useGrid = (objCtrlDetails) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      try {
        const $ = checkJQuery();
        createGridControl({
          ...objCtrlDetails,
          thisObjID: $(elementRef.current)
        });
      } catch (error) {
        console.error('Error creating grid:', error);
      }
    }
  }, []);

  // Method to update grid data
  const updateData = (data) => {
    if (elementRef.current) {
      try {
        const $ = checkJQuery();
        const grid = $(elementRef.current);
        
        const source = {
          datatype: "json",
          localdata: data
        };
        
        const dataAdapter = new $.jqx.dataAdapter(source);
        grid.jqxGrid('source', dataAdapter);
      } catch (error) {
        console.error('Error updating grid data:', error);
      }
    }
  };

  return { elementRef, updateData };
};

// React Hook for Tree
export const useTree = (objCtrlDetails) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      try {
        const $ = checkJQuery();
        createTreeControl({
          ...objCtrlDetails,
          thisObjID: $(elementRef.current)
        });
      } catch (error) {
        console.error('Error creating tree:', error);
      }
    }
  }, []);

  return elementRef;
};

// React Hook for Listbox
export const useListbox = (objCtrlDetails) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      try {
        const $ = checkJQuery();
        createListboxControl({
          ...objCtrlDetails,
          thisObjID: $(elementRef.current)
        });
      } catch (error) {
        console.error('Error creating listbox:', error);
      }
    }
  }, []);

  return elementRef;
};

// React Hook for DatePicker
export const useDatePicker = (objCtrlDetails) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      try {
        const $ = checkJQuery();
        createDatePickerControl({
          ...objCtrlDetails,
          thisObjID: $(elementRef.current)
        });
      } catch (error) {
        console.error('Error creating date picker:', error);
      }
    }
  }, []);

  return elementRef;
};

// React Hook for Dropdown
export const useDropDown = (objCtrlDetails) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      try {
        const $ = checkJQuery();
        createDropDownControl({
          ...objCtrlDetails,
          thisObjID: $(elementRef.current)
        });
      } catch (error) {
        console.error('Error creating dropdown:', error);
      }
    }
  }, []);

  return elementRef;
};

// Example React Component using these utilities
export const JQWidgetsExample = () => {
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

// Export all functions for backward compatibility
export default {
  createComboboxControl,
  createGridControl,
  createTreeControl,
  createListboxControl,
  createDatePickerControl,
  createDropDownControl,
  useCombobox,
  useGrid,
  useTree,
  useListbox,
  useDatePicker,
  useDropDown
};
