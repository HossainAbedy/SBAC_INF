import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const FilterSelect = ({ label, value, onChange, options, disabled }) => {
  return (
    <FormControl fullWidth sx={{ bgcolor: "white", borderRadius: 2, boxShadow: 1 }} disabled={disabled}>
      <InputLabel sx={{ fontSize: 14 }}>{label}</InputLabel>
      <Select value={value} onChange={onChange} sx={{ height: 45, fontSize: 14 }}>
        <MenuItem value="">All</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
