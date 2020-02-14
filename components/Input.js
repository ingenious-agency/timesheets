import React from "react";
import Papa from "papaparse";
import styled from "styled-components";

import { Button } from "./Button";

const Container = styled.div`
  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  ${Button} {
    display: inline-block;
  }
`;

// border: 1px solid ${({ theme }) => theme.colors.orange};

export const Input = ({ onFile, title }) => {
  return (
    <Container>
      <input
        type="file"
        id="file"
        onChange={event => {
          Papa.parse(event.target.files[0], {
            complete(results) {
              onFile(results.data);
            }
          });
        }}
      />
      <Button as="label" htmlFor="file">
        {title}
      </Button>
    </Container>
  );
};
