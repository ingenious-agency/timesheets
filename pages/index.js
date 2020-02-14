import React, { useState } from "react";
import styled from "styled-components";

import { Input } from "../components/Input";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 4rem 0 4rem;
  height: calc(100vh - 2rem - 72px);
  justify-content: center;
`;

export default () => {
  const [timesheetHeader, setTimesheetHeader] = useState([]);
  const [timesheetContent, setTimesheetContent] = useState([]);

  const timesheetMap = item => {
    // [description, duration, start date]
    return [item[5], item[11], item[7]];
  };

  const onFileContents = data => {
    setTimesheetHeader(timesheetMap(data[0]));
    setTimesheetContent(data.slice(1).map(timesheetMap));
  };

  return (
    <Container>
      <Input title="Upload your timesheet" onFile={onFileContents} />
      {/* <Table>
        <Header data={timesheetHeader} />
        <Contents data={timesheetContent} />
      </Table>
      <Button>Save 💾</Button> */}
    </Container>
  );
};
