import React, { useEffect, useRef, useState } from 'react';
import { useGrid } from './jqwidgetsMigration';
import './ReusableGrid.css';

/**
 * ReusableGrid Component with State Preservation on Data Loading Errors
 * 
 * Features:
 * - Validates data before updating the grid
 * - Maintains previous valid state when new data loading fails
 * - Configurable state maintenance behavior via maintainStateOnError prop
 * - Error callback support via onDataError prop
 * - Robust error handling for various data validation scenarios
 * - Flexible cell coloring with active/inactive colors and custom color functions
 * 
 * @param {Array} data - Grid data array
 * @param {Array} columns - Column configuration
 * @param {boolean} maintainStateOnError - Whether to maintain previous state on data errors (default: true)
 * @param {Function} onDataError - Callback function called when data validation fails
 * @param {string} activeColor - Color for active status cells (default: '#28a745') - works with 'Active' or 'active'
 * @param {string} inactiveColor - Color for inactive status cells (default: '#dc3545') - works with 'Deactive', 'deactive', 'Inactive', or 'inactive'
 * @param {Function} cellColorFunction - Custom function to determine cell color: (rowData, columnData, cellText, rowIndex, columnIndex) => color
 * @param {Function} onScroll - Callback function called when grid is scrolled: (scrollInfo, event) => void
 * @param {*} ...otherProps - Other grid properties
 */
const ReusableGrid = ({ 
  data, 
  columns, 
  width = '100%', 
  height = 350, 
  onRowSelect, 
  onCellClick,
  onCellSelect,
  onRowDrag,
  onScroll, // New scroll event handler
  selectedRowIndex = -1,
  className = '',
  maintainStateOnError = true, // New prop to control state maintenance behavior
  onDataError, // New callback for data validation errors
  equalColumnWidths = true,
  // Color props for cell styling
  activeColor = '#28a745', // Default green for active status
  inactiveColor = '#dc3545', // Default red for inactive status
  cellColorFunction, // Function to determine cell color based on data
  ...gridProps 
}) => {
  // Track if selection is from user interaction to prevent external override
  const userInteractionRef = useRef(false);
  const lastSelectedRowRef = useRef(-1);
  
  // State to maintain previous valid data when new data loading fails
  const [validData, setValidData] = useState([]);
  const [isDataValid, setIsDataValid] = useState(false);
  
  // Local state for immediate updates (imitation/simulation)
  const [localData, setLocalData] = useState([]);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  
  // Methods for immediate data manipulation (imitation/simulation)
  const addRow = (newRow) => {
    try {
      const updatedData = [...localData, { ...newRow, id: newRow.id || Date.now() }];
      setLocalData(updatedData);
      setHasLocalChanges(true);
      updateGridData(updatedData);
      console.log('Row added locally:', newRow);
      return true;
    } catch (error) {
      console.error('Error adding row:', error);
      return false;
    }
  };

  const updateRow = (rowIndex, updatedRow) => {
    try {
      const updatedData = localData.map((row, index) => 
        index === rowIndex ? { ...row, ...updatedRow } : row
      );
      setLocalData(updatedData);
      setHasLocalChanges(true);
      updateGridData(updatedData);
      console.log('Row updated locally:', updatedRow);
      return true;
    } catch (error) {
      console.error('Error updating row:', error);
      return false;
    }
  };

  const deleteRow = (rowIndex) => {
    try {
      const updatedData = localData.filter((_, index) => index !== rowIndex);
      setLocalData(updatedData);
      setHasLocalChanges(true);
      updateGridData(updatedData);
      console.log('Row deleted locally at index:', rowIndex);
      return true;
    } catch (error) {
      console.error('Error deleting row:', error);
      return false;
    }
  };

  const resetLocalChanges = () => {
    setLocalData([]);
    setHasLocalChanges(false);
    if (isDataValid && validData.length > 0) {
      updateGridData(validData);
    } else {
      updateGridData([]);
    }
    console.log('Local changes reset');
  };

  const getCurrentData = () => {
    return hasLocalChanges ? localData : validData;
  };

  // Function to validate data before updating grid
  const validateData = (newData) => {
    try {
      // Check if data is valid
      if (!newData || !Array.isArray(newData)) {
        console.warn('Invalid data: data is not an array or is null/undefined');
        return false;
      }
      
      // Allow empty arrays (remove this check if empty arrays should be considered invalid)
      if (newData.length === 0) {
        console.log('Data is empty array - this is valid');
        return true;
      }
      
      // Check if all items are objects (basic validation)
      const hasInvalidItems = newData.some(item => 
        !item || typeof item !== 'object' || Array.isArray(item)
      );
      
      if (hasInvalidItems) {
        console.warn('Invalid data: some items are not valid objects');
        return false;
      }
      
      // Additional validation: check for common data structure issues
      const hasCircularReferences = newData.some(item => {
        try {
          JSON.stringify(item);
          return false;
        } catch (e) {
          return true;
        }
      });
      
      if (hasCircularReferences) {
        console.warn('Invalid data: contains circular references');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating data:', error);
      return false;
    }
  };
  
  // Use the centralized grid hook
  const { elementRef: gridRef, updateData: updateGridData } = useGrid({
    clsColumnDetails: columns,
    width,
    height,
    objControlProperty: {
      selectionmode: 'singlerow',
      enablehover: true,
      showstatusbar: false,
      ...gridProps
    }
  });

  // Update data when data prop changes
  useEffect(() => {
    if (data) {
      // Validate the new data
      if (validateData(data)) {
        // Data is valid, update the grid and state
        try {
          // Reset local changes when new valid data comes from parent
          setLocalData([]);
          setHasLocalChanges(false);
          
          updateGridData(data);
          setValidData(data);
          setIsDataValid(true);
          
          // Reset user interaction flag when data changes
          userInteractionRef.current = false;
          lastSelectedRowRef.current = -1;
          
          // Auto-select first row when data loads (if no specific selectedRowIndex is provided)
          if (selectedRowIndex === -1 && data.length > 0) {
            setTimeout(() => {
              try {
                const $ = window.$;
                const grid = $(gridRef.current);
                if (grid && grid.jqxGrid) {
                  grid.jqxGrid('selectrow', 0);
                  lastSelectedRowRef.current = 0;
                  console.log('Auto-selected first row');
                }
              } catch (error) {
                console.error('Error auto-selecting first row:', error);
              }
            }, 0);
          }
        } catch (error) {
          console.error('Error updating grid with valid data:', error);
          // Even if update fails, we still consider the data valid for state maintenance
          setValidData(data);
          setIsDataValid(true);
        }
      } else {
        // Data is invalid, handle based on maintainStateOnError prop
        console.warn('Data validation failed');
        
        // Call error callback if provided
        if (onDataError) {
          try {
            onDataError(data, 'Data validation failed');
          } catch (callbackError) {
            console.error('Error in onDataError callback:', callbackError);
          }
        }
        
        if (maintainStateOnError && isDataValid && validData.length > 0) {
          console.log('Using previous valid data to maintain grid state');
          // Don't update the grid, keep the previous valid data
        } else {
          // Clear the grid if maintainStateOnError is false or no previous valid data
          try {
            updateGridData([]);
            setValidData([]);
            setIsDataValid(false);
            setLocalData([]);
            setHasLocalChanges(false);
            console.log('Cleared grid due to invalid data');
          } catch (error) {
            console.error('Error clearing grid:', error);
          }
        }
      }
    } else {
      // Data is null/undefined, clear the grid
      try {
        updateGridData([]);
        setValidData([]);
        setIsDataValid(false);
        setLocalData([]);
        setHasLocalChanges(false);
      } catch (error) {
        console.error('Error clearing grid for null data:', error);
      }
    }
  }, [data]);
 const calculateEqualColumnWidths = (columns, gridWidth) => {
    if (!columns || columns.length === 0) return columns;
    
    // Parse width to get numeric value
    let numericWidth = gridWidth;
    if (typeof gridWidth === 'string') {
      if (gridWidth.includes('%')) {
        // For percentage widths, try to get actual container width or use fallback
        const container = document.querySelector('.reusable-grid');
        if (container) {
          numericWidth = container.offsetWidth || 800;
        } else {
          numericWidth = 800; // Default fallback width
        }
      } else if (gridWidth.includes('px')) {
        numericWidth = parseInt(gridWidth.replace('px', ''));
      } else {
        numericWidth = parseInt(gridWidth) || 800;
      }
    }
    
    // Ensure minimum width
    numericWidth = Math.max(numericWidth, 400);
    
    // Calculate equal width for each column (subtract some space for scrollbar and borders)
    const scrollbarWidth = 20; // Account for potential scrollbar
    const borderWidth = 2; // Account for grid borders
    const availableWidth = numericWidth - scrollbarWidth - borderWidth;
    const equalWidth = Math.max(Math.floor(availableWidth / columns.length), 100); // Minimum 100px per column
    
    console.log(`Calculating equal widths: totalWidth=${numericWidth}, availableWidth=${availableWidth}, equalWidth=${equalWidth}, columns=${columns.length}`);
    
    // Update columns with equal width
    const updatedColumns = columns.map(column => ({
      ...column,
      width: equalWidth
    }));
    
    console.log('Updated columns with equal width:', updatedColumns);
    return updatedColumns;
  };

  // Calculate column widths based on equalColumnWidths prop
  const columnsWithEqualWidth = equalColumnWidths 
    ? calculateEqualColumnWidths(columns, width)
    : columns;
  
  // Debug logging
  console.log('Original columns:', columns);
  console.log('Columns with equal width:', columnsWithEqualWidth);


  // Recalculate column widths when width, columns, or equalColumnWidths prop change
  useEffect(() => {
    if (gridRef.current && columns && columns.length > 0) {
      try {
        const $ = window.$;
        const grid = $(gridRef.current);
        
        // Recalculate column widths based on equalColumnWidths prop
        const newColumnsWithEqualWidth = equalColumnWidths 
          ? calculateEqualColumnWidths(columns, width)
          : columns;
        
        // Update grid columns
        if (grid.jqxGrid) {
          grid.jqxGrid('columns', newColumnsWithEqualWidth);
        }
      } catch (error) {
        console.error('Error updating column widths:', error);
      }
    }
  }, [ equalColumnWidths]);
  // Setup grid events
  useEffect(() => {
    debugger
            applyStatusColors();
        applyScrollbarStyling();
    if (gridRef.current) {
      const $ = window.$;
      const grid = $(gridRef.current);
      
      const setupEvents = () => {
        try {
          // Check if grid is initialized
          if (!grid.jqxGrid || typeof grid.jqxGrid !== 'function') {
            setTimeout(setupEvents, 100);
            return;
          }

          // Row selection event - only handle programmatic selection changes
          if (onRowSelect) {
            grid.off('rowselect');
            grid.on('rowselect', (event) => {
              try {
                const rowData = grid.jqxGrid('getrowdata', event.args.rowindex);
                onRowSelect(rowData, event.args.rowindex);
              } catch (error) {
                console.error('Error in rowselect:', error);
              }
            });
          }

          // Cell click event - handles both row selection and custom cell click
          grid.off('cellclick');
          grid.on('cellclick', (event) => {
            try {
              // Mark this as user interaction
              userInteractionRef.current = true;
              lastSelectedRowRef.current = event.args.rowindex;
              
              // Select the row when any cell is clicked
              grid.jqxGrid('selectrow', event.args.rowindex);
              
              // Trigger row selection callback if available
              if (onRowSelect) {
                const rowData = grid.jqxGrid('getrowdata', event.args.rowindex);
                onRowSelect(rowData, event.args.rowindex);
              }
              
              // Trigger custom cell click callback if available
              if (onCellClick) {
                const rowData = grid.jqxGrid('getrowdata', event.args.rowindex);
                onCellClick(rowData, event.args.rowindex, event.args.datafield);
              }
            } catch (error) {
              console.error('Error in cell click:', error);
            }
          });

          // Cell selection event
          if (onCellSelect) {
            grid.off('cellselect');
            grid.on('cellselect', (event) => {
              try {
                const rowData = grid.jqxGrid('getrowdata', event.args.rowindex);
                onCellSelect(rowData, event.args.rowindex, event.args.datafield);
              } catch (error) {
                console.error('Error in cellselect:', error);
              }
            });
          }

          // Row drag events
          if (onRowDrag) {
            grid.off('rowdragstart rowdragend rowdrag');
            grid.on('rowdragstart', (event) => {
              try {
                const rowData = grid.jqxGrid('getrowdata', event.args.rowindex);
                onRowDrag('start', rowData, event.args.rowindex);
              } catch (error) {
                console.error('Error in rowdragstart:', error);
              }
            });
            
            grid.on('rowdragend', (event) => {
              try {
                const rowData = grid.jqxGrid('getrowdata', event.args.rowindex);
                onRowDrag('end', rowData, event.args.rowindex);
              } catch (error) {
                console.error('Error in rowdragend:', error);
              }
            });
            
            grid.on('rowdrag', (event) => {
              try {
                const rowData = grid.jqxGrid('getrowdata', event.args.rowindex);
                onRowDrag('drag', rowData, event.args.rowindex);
              } catch (error) {
                console.error('Error in rowdrag:', error);
              }
            });
          }

          // Scroll events - using native DOM scroll events since jQWidgets doesn't have a native scroll event
          if (onScroll) {
            // Remove existing scroll listeners
            const gridElement = gridRef.current;
            if (gridElement && gridElement._scrollHandler) {
              const contentArea = grid.find('.jqx-grid-content')[0];
              if (contentArea) {
                contentArea.removeEventListener('scroll', gridElement._scrollHandler);
              } else {
                gridElement.removeEventListener('scroll', gridElement._scrollHandler);
              }
            }
            
            // Add new scroll listener
            const handleScroll = (event) => {
              try {
                const scrollElement = event.target;
                const scrollInfo = {
                  scrollTop: scrollElement.scrollTop || 0,
                  scrollLeft: scrollElement.scrollLeft || 0,
                  scrollHeight: scrollElement.scrollHeight || 0,
                  scrollWidth: scrollElement.scrollWidth || 0,
                  clientHeight: scrollElement.clientHeight || 0,
                  clientWidth: scrollElement.clientWidth || 0
                };
                onScroll(scrollInfo, event);
              } catch (error) {
                console.error('Error in scroll event:', error);
              }
            };
            
            // Store the handler for cleanup
            gridElement._scrollHandler = handleScroll;
            
            // Add scroll listener to the grid content area
            const contentArea = grid.find('.jqx-grid-content')[0];
            if (contentArea) {
              console.log('Adding scroll listener to content area');
              contentArea.addEventListener('scroll', handleScroll);
            } else {
              console.log('Content area not found, adding scroll listener to grid element');
              // Fallback to the main grid element
              gridElement.addEventListener('scroll', handleScroll);
            }
            
            // Also try adding to the grid container
            const gridContainer = grid.find('.jqx-grid-container')[0];
            if (gridContainer) {
              console.log('Adding scroll listener to grid container');
              gridContainer.addEventListener('scroll', handleScroll);
            }
          }

          // Hover effects
          grid.off('rowhover rowunhover cellhover cellunhover');
          grid.on('rowhover', (event) => {
            try {
              const row = grid.jqxGrid('getrow', event.args.rowindex);
              if (row) {
                $(row).addClass('jqx-grid-row-hover');
              }
            } catch (error) {
              console.error('Error in rowhover:', error);
            }
          });

          grid.on('rowunhover', (event) => {
            try {
              const row = grid.jqxGrid('getrow', event.args.rowindex);
              if (row) {
                $(row).removeClass('jqx-grid-row-hover');
              }
            } catch (error) {
              console.error('Error in rowunhover:', error);
            }
          });

          // Cell hover effects
          grid.on('cellhover', (event) => {
            try {
              const cell = grid.jqxGrid('getcell', event.args.rowindex, event.args.datafield);
              if (cell) {
                $(cell).addClass('jqx-grid-cell-hover');
              }
            } catch (error) {
              console.error('Error in cellhover:', error);
            }
          });

          grid.on('cellunhover', (event) => {
            try {
              const cell = grid.jqxGrid('getcell', event.args.rowindex, event.args.datafield);
              if (cell) {
                $(cell).removeClass('jqx-grid-cell-hover');
              }
            } catch (error) {
              console.error('Error in cellunhover:', error);
            }
          });

          console.log('Grid events setup completed');
        } catch (error) {
          console.error('Error setting up grid events:', error);
          setTimeout(setupEvents, 200);
        }
      };

      // Setup events when grid binding is complete and with fallback delay
      grid.on('bindingcomplete', setupEvents);
      setTimeout(setupEvents, 500);
    }
  }, [onRowSelect, onCellClick, onCellSelect, onRowDrag, onScroll, data]);

  // Handle selected row highlighting - only when selectedRowIndex prop changes
  useEffect(() => {
    if (gridRef.current) {
      try {
        const $ = window.$;
        const grid = $(gridRef.current);
   
        // Wait for grid to be ready
        setTimeout(() => {
          try {
            // Only apply external selection if it's not from user interaction
            // or if the selectedRowIndex is different from what user selected
            if (selectedRowIndex >= 0 && (!userInteractionRef.current || selectedRowIndex !== lastSelectedRowRef.current)) {
              // Clear previous selection first
              grid.jqxGrid('clearselection');
              // Select the specified row
              grid.jqxGrid('selectrow', selectedRowIndex);
              lastSelectedRowRef.current = selectedRowIndex;
              console.log('Selected row index:', selectedRowIndex);
            } else if (selectedRowIndex === -1 && !userInteractionRef.current) {
              // Only clear selection if explicitly set to -1 and not from user interaction
              grid.jqxGrid('clearselection');
              lastSelectedRowRef.current = -1;
              console.log('Cleared selection - no row selected');
            }
          } catch (error) {
            console.error('Error setting selected row:', error);
          }
        }, 100);
      } catch (error) {
        console.error('Error in selected row effect:', error);
      }
    }
  }, [selectedRowIndex]);

  // Standalone function to apply status colors
  const applyStatusColors = () => {
    if (gridRef.current && data && data.length > 0) {
      try {
        const $ = window.$;
        const grid = $(gridRef.current);
        
        // Find all cells and apply colors
        const statusCells = grid.find('.jqx-grid-cell');
        statusCells.each(function() {
          const $cell = $(this);
          const cellText = $cell.text().trim().toLowerCase();
          const rowIndex = $cell.closest('.jqx-grid-row').index();
          const columnIndex = $cell.index();
          
          // Remove existing color classes
          $cell.removeClass('status-active status-deactive custom-cell-color');
          
          // Apply custom color function if provided
          if (cellColorFunction && data && data[rowIndex]) {
            const rowData = data[rowIndex];
            const columnData = columns[columnIndex];
            const customColor = cellColorFunction(rowData, columnData, cellText, rowIndex, columnIndex);
            if (customColor) {
              $cell.css('color', customColor);
              $cell.addClass('custom-cell-color');
              return;
            }
          }
          
          // Default status-based coloring
          if (cellText === 'active' || cellText === 'Active') {
            $cell.css('color', activeColor);
            $cell.addClass('status-active');
          } else if (cellText === 'deactive' || cellText === 'Deactive' || cellText === 'inactive' || cellText === 'Inactive') {
            $cell.css('color', inactiveColor);
            $cell.addClass('status-deactive');
          } else {
            // Reset to default color if no specific status
            $cell.css('color', '');
          }
        });
      } catch (error) {
        console.error('Error applying status colors:', error);
      }
    }
  };

  // Standalone function to apply scrollbar styling
  const applyScrollbarStyling = () => {
    if (gridRef.current) {
      try {
        const $ = window.$;
        const grid = $(gridRef.current);
        
        // Force scrollbar styling with JavaScript
        const scrollbars = grid.find('.jqx-grid-scrollbar, .jqx-grid-scrollbar-vertical, .jqx-grid-scrollbar-horizontal');
        scrollbars.each(function() {
          $(this).css({
            'width': '12px',
            'height': '12px',
            'background-color': '#f5f5f5',
            'background': '#f5f5f5'
          });
        });

        const thumbs = grid.find('.jqx-grid-scrollbar-thumb');
        thumbs.each(function() {
          $(this).css({
            'background-color': 'white',
            'background': 'white',
            'width': '10px',
            'height': '10px',
            'border': '1px solid #ddd'
          });
        });

        const tracks = grid.find('.jqx-grid-scrollbar-track');
        tracks.each(function() {
          $(this).css({
            'background-color': '#f5f5f5',
            'background': '#f5f5f5'
          });
        });
      } catch (error) {
        console.error('Error applying scrollbar styling:', error);
      }
    }
  };

  // Standalone function to get current scroll position
  const getScrollPosition = () => {
    if (gridRef.current) {
      try {
        const $ = window.$;
        const grid = $(gridRef.current);
        
        if (grid.jqxGrid) {
          const scrollInfo = {
            scrollTop: grid.jqxGrid('scrollposition').top || 0,
            scrollLeft: grid.jqxGrid('scrollposition').left || 0,
            scrollHeight: grid.jqxGrid('scrollposition').height || 0,
            scrollWidth: grid.jqxGrid('scrollposition').width || 0
          };
          return scrollInfo;
        }
      } catch (error) {
        console.error('Error getting scroll position:', error);
      }
    }
    return null;
  };

  // Standalone function to scroll to specific position
  const scrollTo = (scrollTop = 0, scrollLeft = 0) => {
    if (gridRef.current) {
      try {
        const $ = window.$;
        const grid = $(gridRef.current);
        
        if (grid.jqxGrid) {
          grid.jqxGrid('scrollposition', { top: scrollTop, left: scrollLeft });
        }
      } catch (error) {
        console.error('Error scrolling to position:', error);
      }
    }
  };

  // Apply status colors and scrollbar styling after grid is rendered
  useEffect(() => {
    if (gridRef.current && data && data.length > 0) {
      const $ = window.$;
      const grid = $(gridRef.current);

      // Apply colors and scrollbar styling after grid binding is complete
      grid.on('bindingcomplete', () => {
        applyStatusColors();
        applyScrollbarStyling();
      });
      setTimeout(() => {
        applyStatusColors();
        applyScrollbarStyling();
      }, 500);
    }
  }, [data]);

  // Cleanup scroll listeners on unmount
  useEffect(() => {
    return () => {
      if (gridRef.current && gridRef.current._scrollHandler) {
        const $ = window.$;
        const grid = $(gridRef.current);
        const contentArea = grid.find('.jqx-grid-content')[0];
        if (contentArea) {
          contentArea.removeEventListener('scroll', gridRef.current._scrollHandler);
        } else {
          gridRef.current.removeEventListener('scroll', gridRef.current._scrollHandler);
        }
      }
    };
  }, []);

  // Expose methods via ref if provided
  React.useImperativeHandle(gridProps.gridRef, () => ({
    addRow,
    updateRow,
    deleteRow,
    resetLocalChanges,
    getCurrentData,
    hasLocalChanges: () => hasLocalChanges,
    getValidData: () => validData,
    applyStatusColors,
    applyScrollbarStyling,
    getScrollPosition,
    scrollTo
  }), [localData, validData, hasLocalChanges, applyStatusColors, applyScrollbarStyling, getScrollPosition, scrollTo]);

  return (
    <div className={`reusable-grid ${className}`}>
      <div ref={gridRef}></div>
      {hasLocalChanges && (
        <div style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: '#ff9800',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '3px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          Local Changes
        </div>
      )}
    </div>
  );
};

export default ReusableGrid;
