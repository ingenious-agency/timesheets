import React from "react";
import styled from "styled-components";
import Link from "next/link";

import { Image } from "./Image";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 72px;
  padding: 0 5.5em;
  border-bottom: 1px solid ${({ theme }) => theme.colors.orange};
`;

const Menu = styled.div``;

const MenuItem = styled.a`
  color: ${({ theme }) => theme.colors.black};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 0.75rem;
`;

export const Header = props => {
  return (
    <Container>
      <Image src="/images/logo.svg" alt="Ingenious Logo" />
      <Menu>
        <Link href="/login">
          <MenuItem>Login</MenuItem>
        </Link>
      </Menu>
    </Container>
  );
};
