import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoadJsonFile } from "../../../../components/Admin/AddMovie";
import MovieApi from "../../../../api/Movies";

// Мокаємо API для роботи з фільмами
jest.mock("../../../../api/Movies");

describe("LoadJsonFile component", () => {
  let insertManyMock;

  beforeEach(() => {
    // Створюємо мок для масового додавання фільмів
    insertManyMock = jest.fn();

    // Підміняємо реалізацію MovieApi
    MovieApi.mockReturnValue({
      insertMany: insertManyMock,
    });
  });

  test("renders file input and submit button", () => {
    // Рендеримо компонент завантаження JSON
    render(<LoadJsonFile />);

    // Перевіряємо наявність поля для вибору файлу
    expect(
      screen.getByTestId("file-input")
    ).toBeInTheDocument();

    // Кнопка сабміту спочатку має бути неактивною
    expect(
      screen.getByRole("button")
    ).toBeDisabled();
  });

  test("enables submit button after valid JSON file upload", async () => {
    // Рендеримо компонент
    render(<LoadJsonFile />);

    const fileInput = screen.getByTestId("file-input");

    // Створюємо коректний JSON-файл
    const file = new File(
      [JSON.stringify([{ title: "Movie 1" }])],
      "movies.json",
      { type: "application/json" }
    );

    // Імітуємо вибір файлу користувачем
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    // Очікуємо, що кнопка стане активною
    await waitFor(() => {
      expect(
        screen.getByRole("button")
      ).not.toBeDisabled();
    });
  });

  test("keeps button disabled when JSON is invalid", async () => {
    // Рендеримо компонент
    render(<LoadJsonFile />);

    const fileInput = screen.getByTestId("file-input");
    const button = screen.getByRole("button");

    // Створюємо некоректний JSON-файл
    const invalidFile = new File(
      ["{ invalid json }"],
      "bad.json",
      { type: "application/json" }
    );

    // Імітуємо вибір файлу
    fireEvent.change(fileInput, {
      target: { files: [invalidFile] },
    });

    // Перевіряємо, що кнопка залишилась неактивною
    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent("Додати");
    });
  });

  test("calls insertMany on submit with parsed JSON", async () => {
    // Рендеримо компонент
    render(<LoadJsonFile />);

    const fileInput = screen.getByTestId("file-input");
    const button = screen.getByRole("button");

    // Дані для додавання
    const jsonData = [{ title: "Movie test" }];

    // Створюємо валідний JSON-файл
    const file = new File(
      [JSON.stringify(jsonData)],
      "movies.json",
      { type: "application/json" }
    );

    // Імітуємо вибір файлу
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    // Очікуємо активацію кнопки
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    // Натискаємо кнопку додавання
    fireEvent.click(button);

    // Перевіряємо, що API викликано з розпарсеними даними
    await waitFor(() => {
      expect(insertManyMock).toHaveBeenCalledWith(jsonData);
      expect(insertManyMock).toHaveBeenCalledTimes(1);
    });
  });
});
