import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("should be able to run tests", () => {
    expect(1 + 2).toEqual(3);
  });
});

// test("renders learn react link", () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
