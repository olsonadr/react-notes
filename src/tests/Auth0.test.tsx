import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

// Mock useAuth0 hook for these tests depending on variables
const dummyUser = {
  name: "John Doe",
  email: "johndoe@me.com",
  email_verified: true,
  sub: "google-oauth2|12345678901234",
};
let mockAuth = false;
let mockLoading = false;
let mockUser: {} | undefined = undefined;
jest.mock("@auth0/auth0-react", () => {
  return {
    useAuth0: () => ({
      user: mockUser,
      isAuthenticated: mockAuth,
      isLoading: mockLoading,
      login: jest.fn(),
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
    }),
  };
});

// Mock socket creation
jest.mock("socket.io-client", () => {
  return (url: string, opts:{[key: string]:any} ) => {return undefined;};
});

test("Auth loading text initially displayed", () => {
  mockAuth = false;
  mockLoading = true;
  mockUser = undefined;

  render(<App />);
  expect(screen.getByText("Authenticating Session...")).toBeTruthy();
});

test("Login displayed and Logout not displayed before login after initial load", () => {
  mockAuth = false;
  mockLoading = false;
  mockUser = undefined;

  render(<App />);
  expect(screen.getByText("Welcome to React Notes!")).toBeTruthy();
  expect(screen.getByText("Please login!")).toBeTruthy();
  expect(screen.getByText("Login")).toBeTruthy();
});

test("Auth loading text displayed after login button press", () => {
  mockAuth = true;
  mockLoading = true;
  mockUser = dummyUser;

  render(<App />);
  expect(screen.getByText("Authenticating Session...")).toBeTruthy();
});

test("Login not displayed after login", () => {
  mockAuth = true;
  mockLoading = false;
  mockUser = dummyUser;

  render(<App />);
  expect(screen.getByText(`Hello, ${dummyUser.name}!`)).toBeTruthy();
});
