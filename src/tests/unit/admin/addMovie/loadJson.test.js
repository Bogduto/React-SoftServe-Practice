import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoadJsonFile } from "../../../../components/Admin/AddMovie";
import MovieApi from "../../../../api/Movies";

jest.mock("../../../../api/Movies");

describe("LoadJsonFile component", () => {
  let insertManyMock;

  beforeEach(() => {
    insertManyMock = jest.fn();
    MovieApi.mockReturnValue({
      insertMany: insertManyMock,
    });
  });

  test("renders file input and submit button", () => {
    render(<LoadJsonFile />);

    expect(screen.getByTestId("file-input")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("enables submit button after valid JSON file upload", async () => {
    render(<LoadJsonFile />);

    const fileInput = screen.getByTestId("file-input");

    const file = new File(
      [JSON.stringify([{ title: "Movie 1" }])],
      "movies.json",
      { type: "application/json" }
    );

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  test("keeps button disabled when JSON is invalid", async () => {
    render(<LoadJsonFile />);

    const fileInput = screen.getByTestId("file-input");
    const button = screen.getByRole("button");

    const invalidFile = new File(["{ invalid json }"], "bad.json", {
      type: "application/json",
    });

    fireEvent.change(fileInput, {
      target: { files: [invalidFile] },
    });

    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent("Додати");
    });
  });

  test("calls insertMany on submit with parsed JSON", async () => {
    render(<LoadJsonFile />);

    const fileInput = screen.getByTestId("file-input");
    const button = screen.getByRole("button");

    const jsonData = [{ title: "Movie test" }];

    const file = new File([JSON.stringify(jsonData)], "movies.json", {
      type: "application/json",
    });

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(insertManyMock).toHaveBeenCalledWith(jsonData);
      expect(insertManyMock).toHaveBeenCalledTimes(1);
    });
  });
});
