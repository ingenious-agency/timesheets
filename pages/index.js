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
  align-items: ${({ hasContent }) => (hasContent ? "flex-end" : "center")};
  padding: 2rem 4rem 0 4rem;
  height: ${({ hasContent }) =>
    hasContent ? "100%" : "calc(100vh - 2rem - 72px)"};
  justify-content: ${({ hasContent }) =>
    hasContent ? "flex-start" : "center"};
  margin-bottom: 4rem;
`;

const InformationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export default () => {
  const timesheetHeader = useMemo(() => [
    { Header: "Task", accessor: "task" },
    { Header: "Project", accessor: "project" },
    { Header: "Duration", accessor: "duration" },
    { Header: "Date", accessor: "date" }
  ]);
  const [timesheetContent, setTimesheetContent] = useState([]);

  const totalHours = useMemo(() => {
    let hours = "00:00:00";
    timesheetContent.forEach(item => {
      hours = str(add([hours, item.duration || "00:00:00"]));
    });
    return hours;
  }, [timesheetContent]);

  const hasContent = useMemo(() => timesheetContent.length > 0, [
    timesheetContent
  ]);

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

  const onFileContents = data => {
    setTimesheetContent(data.slice(1).map(timesheetMap));
  };

  const onDeleteRows = ids => {
    setTimesheetContent(
      timesheetContent.filter((_timesheet, index) => !ids.includes(index))
    );
  };

  const onUpdateData = (rowIndex, columnId, value) => {
    setTimesheetContent(old =>
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

  return (
    <Container hasContent={hasContent}>
      {hasContent && (
        <InformationContainer>
          <Title2>
            Total: <span>{totalHours}</span>
          </Title2>
          <Input onFile={onFileContents} title="Re-upload your timesheet" />
        </InformationContainer>
      )}
      {!hasContent && (
        <Input onFile={onFileContents} title="Upload your timesheet" />
      )}

      <Table
        headers={timesheetHeader}
        data={timesheetContent}
        onDeleteRows={onDeleteRows}
        onUpdateData={onUpdateData}
      />
      {hasContent && (
        <div
          css={css`
            display: flex;
            justify-content: center;
            width: 100%;
            margin: 2rem 0;
          `}
        >
          <Button>Save 💾</Button>
        </div>
      )}
    </Container>
  );
};
