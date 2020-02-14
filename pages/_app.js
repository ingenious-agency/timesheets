import App from "next/app";
import Head from "next/head";
import React from "react";
import { ThemeProvider } from "styled-components";
import theme from "../theme";

import { Header } from "../components/Header";

export default class IngeniousSheetApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Head>
          <link
            rel="stylesheet"
            href="https://unpkg.com/modern-css-reset/dist/reset.min.css"
          />

          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}
