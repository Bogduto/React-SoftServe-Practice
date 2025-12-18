import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MethodChoose from "../../../../components/Admin/AddMovie/MethodChoose";

// Мокаємо дочірні компоненти додавання фільму
jest.mock("../../../../components/Admin/AddMovie", () => ({
  // Компонент завантаження даних з JSON
  LoadJsonFile: () => <div data-testid="load-json">LoadJsonFile</div>,

  // Компонент ручного додавання фільму
  AddMovieForm: () => <div data-testid="add-movie-form">AddMovieForm</div>,
}));

describe("MethodChoose component", () => {
  test("renders method selection buttons initially", () => {
    // Рендеримо компонент вибору методу
    render(<MethodChoose />);

    // Перевіряємо заголовок вибору методу
    expect(
      screen.getByText("Виберіть метод для заповнення даних")
    ).toBeInTheDocument();

    // Перевіряємо наявність кнопок вибору
    expect(screen.getByText("Завантажити дані")).toBeInTheDocument();
    expect(screen.getByText("Заповнити самостійно")).toBeInTheDocument();
  });

  test("shows LoadJsonFile when 'Завантажити дані' is clicked", () => {
    // Рендеримо компонент
    render(<MethodChoose />);

    // Обираємо метод завантаження даних
    fireEvent.click(screen.getByText("Завантажити дані"));

    // Перевіряємо, що відобразився компонент завантаження JSON
    expect(screen.getByTestId("load-json")).toBeInTheDocument();

    // Форма ручного додавання не повинна відображатися
    expect(
      screen.queryByTestId("add-movie-form")
    ).not.toBeInTheDocument();
  });

  test("shows AddMovieForm when 'Заповнити самостійно' is clicked", () => {
    // Рендеримо компонент
    render(<MethodChoose />);

    // Обираємо ручний метод додавання
    fireEvent.click(screen.getByText("Заповнити самостійно"));

    // Перевіряємо, що відобразилась форма додавання фільму
    expect(
      screen.getByTestId("add-movie-form")
    ).toBeInTheDocument();
  });

  test("shows 'Змінити метод' button after choosing method", () => {
    // Рендеримо компонент
    render(<MethodChoose />);

    // Обираємо будь-який метод
    fireEvent.click(screen.getByText("Завантажити дані"));

    // Після вибору методу з'являється кнопка скидання
    expect(
      screen.getByText("Змінити метод")
    ).toBeInTheDocument();
  });

  test("resets method when 'Змінити метод' is clicked", () => {
    // Рендеримо компонент
    render(<MethodChoose />);

    // Обираємо метод завантаження даних
    fireEvent.click(screen.getByText("Завантажити дані"));

    // Скидаємо вибраний метод
    fireEvent.click(screen.getByText("Змінити метод"));

    // Компонент повертається у початковий стан
    expect(
      screen.getByText("Виберіть метод для заповнення даних")
    ).toBeInTheDocument();
  });
});
