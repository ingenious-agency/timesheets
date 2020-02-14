import React from "react";
import styled from "styled-components";

export const Button = styled.button`
  background: ${({ disabled }) =>
    disabled ? `rgba(255, 126, 50, .25)` : `rgb(255, 126, 50)`};
  border-radius: 18px;
  line-height: 1rem;
  box-shadow: 0px 30px 30px 0px rgba(255, 126, 50, 0.25);
  padding: 0.625rem 0.8125rem;
  font-size: 1rem;
  color: white;
  font-family: ${({ theme }) => theme.fonts.primary};
  cursor: pointer;
  border: none;
`;
