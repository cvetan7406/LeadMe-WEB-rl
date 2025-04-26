/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useMemo } from 'react';
import { Table as MuiTable, TableBody, TableContainer, TableRow, IconButton, Checkbox } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

function Table({ columns, rows, onEdit, onDelete, onBulkSelect, selectedRows = [] }) {
  // Add checkbox column to header
  const renderColumns = [
    <VuiBox
      key="select-all"
      component="th"
      textAlign="center"
      fontSize="small"
      fontWeight="bold"
      color="text"
      opacity={0.7}
      pl={1}
      pr={1}
      sx={{ borderBottom: '1px solid #444', padding: '8px' }}
    >
      <Checkbox
        size="medium"
        sx={{
          color: 'white',
          '&.Mui-checked': { color: 'info.main' },
          '& .MuiSvgIcon-root': { fontSize: '24px' },
          padding: 0
        }}
        onChange={(e) => {
          // Select or deselect all rows
          if (e.target.checked) {
            onBulkSelect(rows.map(row => row.id));
          } else {
            onBulkSelect([]);
          }
        }}
        checked={selectedRows.length > 0 && selectedRows.length === rows.length}
        indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
      />
    </VuiBox>,
    ...columns.map(({ name, align }, key) => {
      let pl = key === 0 ? 3 : 1;
      let pr = key === columns.length - 1 ? 3 : 1;

      return (
        <VuiBox
          key={name}
          component="th"
          textAlign={align}
          fontSize="small"
          fontWeight="bold"
          color="text"
          opacity={0.7}
          pl={pl}
          pr={pr}
          sx={{ borderBottom: '1px solid #444', padding: '8px' }}
        >
          {name.toUpperCase()}
        </VuiBox>
      );
    })
  ];

  const renderRows = rows.map((row, key) => {
    const rowKey = `row-${key}`;
    const isSelected = selectedRows.includes(row.id);

    // Add checkbox cell to each row
    const checkboxCell = (
      <VuiBox key={`checkbox-${row.id}`} component="td" textAlign="center" sx={{ padding: '8px' }}>
        <Checkbox
          size="medium"
          sx={{
            color: 'white',
            '&.Mui-checked': { color: 'info.main' },
            '& .MuiSvgIcon-root': { fontSize: '24px' },
            padding: 0
          }}
          checked={isSelected}
          onChange={() => {
            if (isSelected) {
              onBulkSelect(selectedRows.filter(id => id !== row.id));
            } else {
              onBulkSelect([...selectedRows, row.id]);
            }
          }}
        />
      </VuiBox>
    );

    const tableRow = columns.map(({ accessor, align }) => {
      let template;

      if (accessor === "edit") {
        template = (
          <VuiBox key={uuidv4()} component="td" textAlign={align} sx={{ padding: '8px' }}>
            <IconButton aria-label="edit" onClick={() => onEdit(row)}>
              <EditIcon color="warning" />
            </IconButton>
          </VuiBox>
        );
      } else if (accessor === "delete") {
        template = (
          <VuiBox key={uuidv4()} component="td" textAlign={align} sx={{ padding: '8px' }}>
            <IconButton aria-label="delete" onClick={() => onDelete(row.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </VuiBox>
        );
      } else {
        template = (
          <VuiBox key={uuidv4()} component="td" textAlign={align} sx={{ padding: '8px' }}>
            <VuiTypography variant="button" fontWeight="regular" color="text">
              {row[accessor]}
            </VuiTypography>
          </VuiBox>
        );
      }

      return template;
    });

    return <TableRow
      key={rowKey}
      sx={{
        backgroundColor: isSelected ? 'rgba(0, 117, 255, 0.1)' : 'transparent',
        '&:hover': { backgroundColor: 'rgba(0, 117, 255, 0.05)' }
      }}
    >
      {checkboxCell}
      {tableRow}
    </TableRow>;
  });

  return useMemo(
    () => (
      <TableContainer sx={{ width: '100%' }}>
        <MuiTable sx={{ width: '100%', tableLayout: 'fixed' }}>
          <thead>
            <TableRow>{renderColumns}</TableRow>
          </thead>
          <TableBody>{renderRows}</TableBody>
        </MuiTable>
      </TableContainer>
    ),
    [columns, rows, selectedRows, onBulkSelect]
  );
}

Table.defaultProps = {
  columns: [],
  rows: [{}],
  onEdit: () => {},
  onDelete: () => {},
  onBulkSelect: () => {},
  selectedRows: [],
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onBulkSelect: PropTypes.func,
  selectedRows: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

export default Table;
