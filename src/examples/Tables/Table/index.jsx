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

import { Table as MuiTable, TableBody, TableContainer, TableRow, IconButton, Checkbox } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import PropTypes from "prop-types";

function Table({ columns, rows, onEdit, onDelete, onBulkSelect, selectedRows = [] }) {
  const renderColumns = columns.map(({ name, align, label, accessor, width, renderHeader }, key) => {
    let pl = key === 0 ? 3 : 1;
    let pr = key === columns.length - 1 ? 3 : 1;

    const columnName = name || accessor;

    if (columnName === "select" || columnName === "Select") {
      return (
        <VuiBox
          key={columnName}
          component="th"
          width={width || "60px"}
          pt={2}
          pb={2}
          pl={3}
          pr={3}
          textAlign="center"
          sx={{ borderBottom: "1px solid #56577A" }}
        >
          {renderHeader ? (
            renderHeader(columns[key], () => {
              if (selectedRows.length === rows.length) {
                onBulkSelect([]);
              } else {
                onBulkSelect(rows.map(row => row.id));
              }
            }, selectedRows.length === rows.length)
          ) : (
            <Checkbox
              checked={selectedRows.length > 0 && selectedRows.length === rows.length}
              indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
              onChange={(e) => {
                if (e.target.checked) {
                  onBulkSelect(rows.map(row => row.id));
                } else {
                  onBulkSelect([]);
                }
              }}
              sx={{
                color: 'white',
                '&.Mui-checked': { color: 'info.main' },
                '&.MuiCheckbox-indeterminate': { color: 'info.main' },
                '& .MuiSvgIcon-root': { fontSize: 20 }
              }}
            />
          )}
        </VuiBox>
      );
    }

    return (
      <VuiBox
        key={columnName}
        component="th"
        width={width}
        pt={2}
        pb={2}
        pl={3}
        pr={3}
        textAlign={align}
        fontSize="12.84px"
        fontWeight="medium"
        color="text"
        opacity={0.7}
        borderBottom="1px solid #56577A"
      >
        {label || name}
      </VuiBox>
    );
  });

  const renderRows = rows.map((row, key) => {
    const rowKey = `row-${key}`;
    const isSelected = selectedRows.includes(row.id);

    const tableRow = columns.map(({ name, align, accessor, renderCell, width }) => {
      const columnName = name || accessor;
      let template;

      if (columnName === "select" || columnName === "Select") {
        template = (
          <VuiBox
            key={columnName}
            component="td"
            width={width}
            pt={2}
            pb={2}
            pl={3}
            pr={3}
            textAlign="center"
            sx={{ border: "none" }}
          >
            {renderCell ? (
              renderCell(row, () => onBulkSelect(isSelected ? selectedRows.filter(id => id !== row.id) : [...selectedRows, row.id]))
            ) : (
              <Checkbox
                checked={isSelected}
                onChange={() => {
                  if (isSelected) {
                    onBulkSelect(selectedRows.filter(id => id !== row.id));
                  } else {
                    onBulkSelect([...selectedRows, row.id]);
                  }
                }}
                sx={{
                  color: 'white',
                  '&.Mui-checked': { color: 'info.main' },
                  '& .MuiSvgIcon-root': { fontSize: 20 }
                }}
              />
            )}
          </VuiBox>
        );
      } else if (columnName === "edit" || columnName === "Edit") {
        template = (
          <VuiBox
            key={columnName}
            component="td"
            pt={2}
            pb={2}
            pl={3}
            pr={3}
            textAlign={align}
            sx={{ border: "none" }}
          >
            {renderCell ? (
              renderCell(row, null, onEdit)
            ) : (
              <IconButton onClick={() => onEdit?.(row)} sx={{ color: "warning.main" }}>
                <EditIcon />
              </IconButton>
            )}
          </VuiBox>
        );
      } else if (columnName === "delete" || columnName === "Delete") {
        template = (
          <VuiBox
            key={columnName}
            component="td"
            pt={2}
            pb={2}
            pl={3}
            pr={3}
            textAlign={align}
            sx={{ border: "none" }}
          >
            <IconButton onClick={() => onDelete?.(row.id)} sx={{ color: "error.main" }}>
              <DeleteIcon />
            </IconButton>
          </VuiBox>
        );
      } else {
        template = (
          <VuiBox
            key={columnName}
            component="td"
            pt={2}
            pb={2}
            pl={3}
            pr={3}
            textAlign={align}
            fontSize="13px"
            fontWeight="medium"
            color="text"
            sx={{ border: "none" }}
          >
            {row[accessor || name]}
          </VuiBox>
        );
      }

      return template;
    });

    return (
      <TableRow 
        key={rowKey}
        sx={{
          backgroundColor: isSelected ? 'rgba(0, 117, 255, 0.1)' : 'transparent',
          '&:hover': { backgroundColor: 'rgba(0, 117, 255, 0.05)' }
        }}
      >
        {tableRow}
      </TableRow>
    );
  });

  return (
    <TableContainer>
      <MuiTable>
        <VuiBox component="thead">
          <TableRow>{renderColumns}</TableRow>
        </VuiBox>
        <TableBody>{renderRows}</TableBody>
      </MuiTable>
    </TableContainer>
  );
}

Table.defaultProps = {
  columns: [],
  rows: [{}],
  onEdit: () => {},
  onDelete: () => {},
  onBulkSelect: () => {},
  selectedRows: []
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onBulkSelect: PropTypes.func,
  selectedRows: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
};

export default Table;
