import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useParams } from "react-router-dom";
import MovieApi from "../../../../api/Movies";
import AdminMovieEdit from "../../../../pages/admin/AdminMovieEdit";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("../../../../api/Movies");

jest.mock("../../../../components/Admin/EditMovie/EditMovieForm", () => () => (
  <div data-testid="edit-movie-form" />
));

jest.mock("../../../../components/Admin/EditMovie/EditSession", () => () => (
  <div data-testid="edit-session" />
));

describe("AdminMovieEdit", () => {
  beforeEach(() => {
    useParams.mockReturnValue({ id: "1" });
    MovieApi.mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ title: "Movie" }),
    });
  });

  test("renders EditMovieForm by default", async () => {
    render(<AdminMovieEdit />);

    expect(await screen.findByTestId("edit-movie-form")).toBeInTheDocument();
  });

  test("switches to sessions section", async () => {
    render(<AdminMovieEdit />);

    fireEvent.click(await screen.findByText("Сесії"));

    expect(await screen.findByTestId("edit-session")).toBeInTheDocument();
  });
});
