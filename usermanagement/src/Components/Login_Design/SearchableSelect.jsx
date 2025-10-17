// SearchableSelect.jsx
import React from "react";
import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "none",
    borderBottom: state.isFocused ? "2px solid #0e5bca" : "2px solid #d0d0d0",
    borderRadius: 0,
    boxShadow: "none",
    background: "transparent",
    paddingTop: 2,
    paddingBottom: 2,
    minHeight: 36,
    fontFamily: "Verdana, sans-serif",
    fontSize: "14px", // Adjust size as needed
  }),
  valueContainer: (provided) => ({ 
    ...provided, 
    padding: "0 8px",
    fontFamily: "Verdana, sans-serif",
  }),
  singleValue: (provided) => ({ 
    ...provided, 
    color: "#333", 
    marginLeft: 0,
    fontFamily: "Verdana, sans-serif",
    fontSize: "14px",
    fontWeight: "bold",
  }),
  placeholder: (provided) => ({ 
    ...provided, 
    color: "#666",
    fontFamily: "Verdana, sans-serif",
    fontSize: "14px",
  }),
  dropdownIndicator: (provided) => ({ ...provided, padding: 4 }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 6,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    fontFamily: "Verdana, sans-serif",
  }),
  option: (provided, state) => ({
    ...provided,
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    borderLeft: state.isFocused || state.isSelected ? "3px solid #0e5bca" : "4px solid transparent",
    backgroundColor: state.isSelected ? "#F1F1F1" : state.isFocused ? "#F1F1F1"  : "#f7fbff",
    color: "#333",
    fontWeight: state.isSelected ? 700 : 600, // Bold for options
    fontFamily: "Verdana, sans-serif",
    fontSize: "14px",
  }),
  input: (provided) => ({
    ...provided,
    fontFamily: "Verdana, sans-serif",
    fontSize: "24px",
  }),
  menuPortal: base => ({ 
    ...base, 
    zIndex: 9999,
    fontFamily: "Verdana, sans-serif",
  }),
};

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  isSearchable = true,
  isClearable = false,
  isDisabled = false,
  classNamePrefix = "sdms-select"
}) {
  // react-select expects option objects { label, value }
  const selectedOption = options && options.length > 0 ? options.find(o => o.value === value) || null : null;

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(opt) => onChange(opt ? opt.value : "")}
      styles={customStyles}
      placeholder={placeholder}
      isClearable={isClearable}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      menuPlacement="auto"
      menuPortalTarget={document.body}
      classNamePrefix={classNamePrefix}
      // simple filter (case-insensitive substring)
      filterOption={(candidate, input) =>
        !input || candidate.label.toLowerCase().includes(input.toLowerCase())
      }
    />
  );
}
