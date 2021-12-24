import React from "react";
import ReactDOM from "react-dom";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { useAuth0 } from "@auth0/auth0-react";

// Mock useAuth0 hook for these tests depending on variables
const dummyUser = {
  email: "johndoe@me.com",
  email_verified: true,
  sub: "google-oauth2|12345678901234"
};
let mockAuth = false;
let mockLoading = false;
let mockUser:{}|undefined = undefined;
jest.mock('@auth0/auth0-react', () => {
  return { useAuth0: () => ({
    user: mockUser,
    isAuthenticated: mockAuth,
    isLoading: mockLoading,
    login: jest.fn(),
    loginWithRedirect: jest.fn(),
    logout: jest.fn(),
  }) };
});

test("Auth loading text initially displayed", () => {
  mockAuth = false;
  mockLoading = true;
  mockUser = undefined;

  render(<App />);
  expect(screen.getByText('Loading...')).toBeTruthy();
});

test("Login displayed and Logout not displayed before login after initial load", () => {
  mockAuth = false;
  mockLoading = false;
  mockUser = undefined;
  
  render(<App />);
  expect(screen.getByText("Welcome! Please login or signup!")).toBeTruthy();
  expect(screen.getByText("Login")).toBeTruthy();
  expect(screen.queryByText("Logout")).toBeFalsy();
});

test("Auth loading text displayed after login button press", () => {
  mockAuth = true;
  mockLoading = true;
  mockUser = dummyUser;

  render(<App />);
  expect(screen.getByText('Loading...')).toBeTruthy();
});

test("Logout displayed and Login not displayed after login", () => {
  mockAuth = true;
  mockLoading = false;
  mockUser = dummyUser;
  
  render(<App />);
  expect(screen.getByText("Hello!")).toBeTruthy();
  expect(screen.getByText("Logout")).toBeTruthy();
  expect(screen.queryByText("Login")).toBeFalsy();
});
