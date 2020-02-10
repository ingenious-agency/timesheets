import React from "react";
import Papa from "papaparse";

export const Input = ({ onFile }) => {
  return (
    <input
      type="file"
      onChange={event => {
        Papa.parse(event.target.files[0], {
          complete(results) {
            onFile(results.data);
          }
        });
      }}
    />
  );
};
