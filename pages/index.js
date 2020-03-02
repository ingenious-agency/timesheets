import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { add, str } from "timelite/time";
import { format, parse, parseISO } from "date-fns/fp";

import { Input } from "../components/Input";
import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { Title2 } from "../components/Title";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ hasContents }) => (hasContents ? "flex-end" : "center")};
  padding: 2rem 4rem 0 4rem;
  height: ${({ hasContent }) =>
    hasContent ? "100%" : "calc(100vh - 2rem - 72px)"};
  justify-content: ${({ hasContents }) =>
    hasContents ? "flex-start" : "center"};
  margin-bottom: 4rem;
`;

const InformationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 2rem 0;
`;

const useTimesheetState = config => {
  const [data, setData] = useState([]);

  const totalHours = useMemo(() => {
    let hours = "00:00:00";
    data.forEach(item => {
      hours = str(add([hours, item[config.hoursColumn] || "00:00:00"]));
    });
    return hours;
  }, [data]);

  const hasData = useMemo(() => data.length > 0, [data]);

  const replaceRow = (rowIndex, columnId, value) => {
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value
          };
        }
        return row;
      })
    );
  };

  const deleteRows = idsToDelete => {
    setData(data.filter((_timesheet, index) => !idsToDelete.includes(index)));
  };

  return { data, setData, hasData, totalHours, replaceRow, deleteRows };
};

export default () => {
  const {
    data,
    setData,
    hasData,
    totalHours,
    replaceRow,
    deleteRows
  } = useTimesheetState({ hoursColumn: "duration" });

  const timesheetMap = item => {
    return {
      task: item[5],
      project: item[3],
      duration: [item[11]]
        .filter(str => !!str) // Remove falsy
        .map(parse(new Date(), "HH:mm:ss")) // Parse the string
        .map(format("HH:mm")) // Format the parsed date
        .join(), //To string
      date: [item[7]]
        .filter(str => !!str) // Remove falsy
        .map(parseISO) // Parse the string
        .map(format("MM/dd/yyyy")) // Format the parsed date
        .join() // To string
    };
  };

  const columns = useMemo(() => [
    { Header: "Task", accessor: "task" },
    { Header: "Project", accessor: "project" },
    { Header: "Duration", accessor: "duration" },
    { Header: "Date", accessor: "date" }
  ]);

  const onFileContents = data => {
    setData(data.slice(1).map(timesheetMap));
  };

  return (
    <Container hasContents={hasData}>
      {hasData > 0 && (
        <InformationContainer>
          <Title2>
            Total: <span>{totalHours}</span>
          </Title2>
          <Input onFile={onFileContents} title="Re-upload your timesheet" />
        </InformationContainer>
      )}

      {!hasData && (
        <Input onFile={onFileContents} title="Upload your timesheet" />
      )}

      <Table
        headers={columns}
        data={data}
        onDeleteRows={deleteRows}
        onUpdateData={replaceRow}
      />

      {hasData && (
        <ButtonContainer>
          <Button>Save 💾</Button>
        </ButtonContainer>
      )}
    </Container>
  );
};
