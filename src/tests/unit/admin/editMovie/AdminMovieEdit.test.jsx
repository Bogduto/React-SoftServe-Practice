import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useParams } from "react-router-dom";
import MovieApi from "../../../../api/Movies";
import AdminMovieEdit from "../../../../pages/admin/AdminMovieEdit";

// Мокаємо useParams з react-router-dom, щоб підставити id фільму
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

// Мокаємо API для роботи з фільмами
jest.mock("../../../../api/Movies");

// Мокаємо форму редагування фільму
jest.mock(
  "../../../../components/Admin/EditMovie/EditMovieForm",
  () => () => <div data-testid="edit-movie-form" />
);

// Мокаємо компонент редагування сесій
jest.mock(
  "../../../../components/Admin/EditMovie/EditSession",
  () => () => <div data-testid="edit-session" />
);

describe("AdminMovieEdit", () => {
  beforeEach(() => {
    // Підставляємо id фільму з URL
    useParams.mockReturnValue({ id: "1" });

    // Мокаємо метод отримання одного фільму
    MovieApi.mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ title: "Movie" }),
    });
  });

  test("renders EditMovieForm by default", async () => {
    // Рендеримо сторінку редагування фільму
    render(<AdminMovieEdit />);

    // За замовчуванням має відображатись форма редагування фільму
    expect(
      await screen.findByTestId("edit-movie-form")
    ).toBeInTheDocument();
  });

  test("switches to sessions section", async () => {
    // Рендеримо сторінку
    render(<AdminMovieEdit />);

    // Натискаємо вкладку «Сесії»
    fireEvent.click(await screen.findByText("Сесії"));

    // Перевіряємо, що відобразився компонент редагування сесій
    expect(
      await screen.findByTestId("edit-session")
    ).toBeInTheDocument();
  });
});
