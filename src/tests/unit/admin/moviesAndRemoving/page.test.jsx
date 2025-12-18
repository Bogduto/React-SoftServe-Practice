import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieApi from "../../../../api/Movies";
import AdminPanel from "../../../../pages/admin/AdminPanel";

// Мокаємо API для роботи з фільмами
jest.mock("../../../../api/Movies");

// Мокаємо компоненти адмін-панелі, щоб тестувати лише логіку AdminPanel
jest.mock("../../../../components/Admin/Panel/index", () => ({
  // Спрощений компонент фільму
  Movie: ({ data, deleteAction }) => (
    <div>
      <span>{data.title}</span>
      <button onClick={deleteAction}>Delete</button>
    </div>
  ),

  // Спрощене модальне вікно підтвердження
  AlertModal: ({ handleAccept, handleRefuse }) => (
    <div>
      <button onClick={handleAccept}>Yes</button>
      <button onClick={handleRefuse}>No</button>
    </div>
  ),
}));

// Мокаємо обгортку модального вікна
jest.mock(
  "../../../../components/ModalWrapper",
  () =>
    ({ children, handleClose }) =>
      (
        <div>
          {children}
          <button onClick={handleClose}>Close Modal</button>
        </div>
      )
);

describe("AdminPanel", () => {
  // Мокові дані фільмів
  const moviesMock = [
    { id: "1", title: "Movie 1" },
    { id: "2", title: "Movie 2" },
  ];

  // Моки методів API
  const deleteOneMock = jest.fn();
  const findAllMock = jest.fn();

  beforeEach(() => {
    // Очищаємо попередні виклики перед кожним тестом
    deleteOneMock.mockClear();
    findAllMock.mockClear();

    // Підміняємо реалізацію MovieApi
    MovieApi.mockReturnValue({
      findAll: findAllMock,
      deleteOne: deleteOneMock,
    });
  });

  test("renders movies fetched from API", async () => {
    // API повертає список фільмів
    findAllMock.mockResolvedValue(moviesMock);

    render(<AdminPanel />);

    // Очікуємо, поки всі фільми з'являться в DOM
    for (const movie of moviesMock) {
      await waitFor(() => {
        expect(screen.getByText(movie.title)).toBeInTheDocument();
      });
    }
  });

  test("opens modal and deletes a movie", async () => {
    // API повертає фільми та успішно видаляє один
    findAllMock.mockResolvedValue(moviesMock);
    deleteOneMock.mockResolvedValue();

    render(<AdminPanel />);

    // Чекаємо, поки перший фільм з'явиться
    await waitFor(() => screen.getByText("Movie 1"));

    // Натискаємо кнопку Delete для першого фільму
    fireEvent.click(screen.getAllByText("Delete")[0]);

    // Перевіряємо, що модальне вікно зʼявилось
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();

    // Підтверджуємо видалення
    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      // Перевіряємо, що API викликано один раз з правильним id
      expect(deleteOneMock).toHaveBeenCalledTimes(1);
      expect(deleteOneMock).toHaveBeenCalledWith("1");

      // Перевіряємо, що фільм зник з DOM
      expect(screen.queryByText("Movie 1")).not.toBeInTheDocument();
    });
  });

  test("closes modal without deleting when refuse is clicked", async () => {
    // API повертає список фільмів
    findAllMock.mockResolvedValue(moviesMock);

    render(<AdminPanel />);

    // Чекаємо появи фільмів
    await waitFor(() => screen.getByText("Movie 1"));

    // Натискаємо Delete
    fireEvent.click(screen.getAllByText("Delete")[0]);

    // Відмовляємося від видалення
    fireEvent.click(screen.getByText("No"));

    // Модальне вікно повинно зникнути
    expect(screen.queryByText("Yes")).not.toBeInTheDocument();

    // deleteOne не має викликатись
    expect(deleteOneMock).not.toHaveBeenCalled();
  });
});
