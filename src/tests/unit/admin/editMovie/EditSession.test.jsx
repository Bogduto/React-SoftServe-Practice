import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditSession from "../../../../components/Admin/EditMovie/EditSession";
import SessionApi from "../../../../api/Sessions";

// Мокаємо API для роботи з сесіями
jest.mock("../../../../api/Sessions");

// Мокаємо модальне вікно, щоб не тягнути реальну реалізацію
jest.mock("../../../../components/ModalWrapper", () => ({ children }) => (
  <div data-testid="modal">{children}</div>
));

// Мокаємо UI-компоненти форми
jest.mock("../../../../components/FormUI", () => ({
  Form: ({ children, onSubmit }) => (
    <form onSubmit={onSubmit}>{children}</form>
  ),
  FieldInput: (props) => <input {...props} />,
  SubmitButton: ({ text }) => <button type="submit">{text}</button>,
  Label: ({ children }) => <label>{children}</label>,
}));

// Мокаємо кнопку
jest.mock("../../../../components/Button", () => (props) => (
  <button {...props} />
));

describe("EditSession", () => {
  // Моки методів API
  const findAllMock = jest.fn();
  const addNewSessionMock = jest.fn();
  const removeSessionMock = jest.fn();

  beforeEach(() => {
    // Підміняємо реалізацію SessionApi
    SessionApi.mockReturnValue({
      findAll: findAllMock,
      addNewSession: addNewSessionMock,
      removeSession: removeSessionMock,
      updateSession: jest.fn(),
    });

    // За замовчуванням сесій немає
    findAllMock.mockResolvedValue([]);
  });

  test("renders empty state", async () => {
    // Рендеримо компонент редагування сесій
    render(<EditSession movieId="1" />);

    // Перевіряємо, що відображається повідомлення про відсутність сесій
    expect(
      await screen.findByText("Сесій ще немає.")
    ).toBeInTheDocument();
  });

  test("opens add session modal", async () => {
    // Рендеримо компонент
    render(<EditSession movieId="1" />);

    // Натискаємо кнопку додавання нової сесії
    fireEvent.click(screen.getByText("Додати нову сесію"));

    // Перевіряємо, що модальне вікно відкрилось
    expect(
      await screen.findByTestId("modal")
    ).toBeInTheDocument();
  });

  test("removes session", async () => {
    // API повертає одну сесію
    findAllMock.mockResolvedValueOnce([
      {
        id: "1",
        date: "2024-01-01",
        time: "12:00",
        price: 100,
        seatsNumber: 50,
      },
    ]);

    // Рендеримо компонент
    render(<EditSession movieId="1" />);

    // Натискаємо кнопку "Видалити" для сесії
    fireEvent.click(await screen.findByText("Видалити"));

    // Перевіряємо, що API викликано з правильним id
    await waitFor(() => {
      expect(removeSessionMock).toHaveBeenCalledWith("1");
    });
  });
});
