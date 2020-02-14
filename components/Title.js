import React from "react";
import styled from "styled-components";

export const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.primary};
  color: ${({ theme }) => theme.colors.black};
`;

export const Title2 = styled(Title)`
  font-size: 1.5rem;
  line-height: 2rem;
`;
