import React, { useState, useEffect, useRef } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import styled from "styled-components";

import { Text } from "./Text";
import { Button } from "./Button";

const DeleteButton = styled(Button)`
  box-shadow: none;
  font-size: 0.75rem;
  line-height: 0.75rem;
  padding: 0.375rem 0.5625rem;
  border: none;
`;

const PaginationContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const PaginationItem = styled(Text)`
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.grey : theme.colors.black};
  cursor: pointer;
`;

const Container = styled.div`
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 1rem;
  font-weight: 300;
  margin-top: 4rem;

  table {
    width: 100%;
  }

  thead tr th {
    text-align: left;
    font-size: 1.125rem;
    font-weight: 500;
  }
`;

const Pagination = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 2rem;
  background: white;

  ${PaginationItem} {
    margin-right: 0.5rem;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const Input = styled.input`
  border: none;
  width: 100%;
  outline: none;
`;

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return <input type="checkbox" ref={resolvedRef} {...rest} />;
  }
);

const EditableCell = ({
  cell: { value: initialValue },
  row: { index },
  column: { id },
  updateData // This is a custom function that we supplied to our table instance
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = e => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <Input value={value} onChange={onChange} onBlur={onBlur} />;
};

const defaultColumn = {
  Cell: EditableCell
};

export const Table = ({
  headers,
  data = [],
  onDeleteRows,
  onUpdateData,
  ...rest
}) => {
  if (data.length === 0) return null;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,

    // Pagination
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,

    // Selection
    state: { selectedRowIds }
  } = useTable(
    {
      columns: headers,
      data,
      defaultColumn,
      initialState: { pageSize: 25 },

      // This is custom
      updateData: onUpdateData
    },
    usePagination,
    useRowSelect,
    hooks => {
      hooks.flatColumns.push(columns => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          )
        },
        ...columns
      ]);
    }
  );
  return (
    <Container>
      <table {...getTableProps()} {...rest}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination>
        <DeleteButton
          disabled={Object.keys(selectedRowIds).length === 0}
          onClick={_e => {
            const ids = Object.keys(selectedRowIds)
              .filter(selected => !!selectedRowIds[selected])
              .map(Number);
            onDeleteRows(ids);
          }}
        >
          Delete Entry
        </DeleteButton>
        <PaginationContainer>
          <PaginationItem
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </PaginationItem>{" "}
          <PaginationItem
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {"<"}
          </PaginationItem>{" "}
          <PaginationItem onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </PaginationItem>{" "}
          <PaginationItem
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </PaginationItem>
        </PaginationContainer>
      </Pagination>
    </Container>
  );
};
