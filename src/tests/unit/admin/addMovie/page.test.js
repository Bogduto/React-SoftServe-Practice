import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MethodChoose from "../../../../components/Admin/AddMovie/MethodChoose";

jest.mock("../../../../components/Admin/AddMovie", () => ({
  LoadJsonFile: () => <div data-testid="load-json">LoadJsonFile</div>,
  AddMovieForm: () => <div data-testid="add-movie-form">AddMovieForm</div>,
}));

describe("MethodChoose component", () => {
  test("renders method selection buttons initially", () => {
    render(<MethodChoose />);

    expect(
      screen.getByText("Виберіть метод для заповнення даних")
    ).toBeInTheDocument();

    expect(screen.getByText("Завантажити дані")).toBeInTheDocument();
    expect(screen.getByText("Заповнити самостійно")).toBeInTheDocument();
  });

  test("shows LoadJsonFile when 'Завантажити дані' is clicked", () => {
    render(<MethodChoose />);

    fireEvent.click(screen.getByText("Завантажити дані"));

    expect(screen.getByTestId("load-json")).toBeInTheDocument();
    expect(screen.queryByTestId("add-movie-form")).not.toBeInTheDocument();
  });

  test("shows AddMovieForm when 'Заповнити самостійно' is clicked", () => {
    render(<MethodChoose />);

    fireEvent.click(screen.getByText("Заповнити самостійно"));

    expect(screen.getByTestId("add-movie-form")).toBeInTheDocument();
  });

  test("shows 'Змінити метод' button after choosing method", () => {
    render(<MethodChoose />);

    fireEvent.click(screen.getByText("Завантажити дані"));

    expect(screen.getByText("Змінити метод")).toBeInTheDocument();
  });

  test("resets method when 'Змінити метод' is clicked", () => {
    render(<MethodChoose />);

    fireEvent.click(screen.getByText("Завантажити дані"));
    fireEvent.click(screen.getByText("Змінити метод"));

    expect(
      screen.getByText("Виберіть метод для заповнення даних")
    ).toBeInTheDocument();
  });
});
