import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieApi from "../../../../api/Movies";
import AdminPanel from "../../../../pages/admin/AdminPanel";

// ---------- Моки ----------
jest.mock("../../../../api/Movies");

jest.mock("../../../../components/Admin/Panel/index", () => ({
  Movie: ({ data, deleteAction }) => (
    <div>
      <span>{data.title}</span>
      <button onClick={deleteAction}>Delete</button>
    </div>
  ),
  AlertModal: ({ handleAccept, handleRefuse }) => (
    <div>
      <button onClick={handleAccept}>Yes</button>
      <button onClick={handleRefuse}>No</button>
    </div>
  ),
}));

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

// ---------- Тесты ----------
describe("AdminPanel", () => {
  const moviesMock = [
    { id: "1", title: "Movie 1" },
    { id: "2", title: "Movie 2" },
  ];
  const deleteOneMock = jest.fn();
  const findAllMock = jest.fn();

  beforeEach(() => {
    deleteOneMock.mockClear();
    findAllMock.mockClear();

    MovieApi.mockReturnValue({
      findAll: findAllMock,
      deleteOne: deleteOneMock,
    });
  });

  test("renders movies fetched from API", async () => {
    findAllMock.mockResolvedValue(moviesMock);

    render(<AdminPanel />);

    // Ждём, пока фильмы отобразятся
    for (const movie of moviesMock) {
      await waitFor(() => {
        expect(screen.getByText(movie.title)).toBeInTheDocument();
      });
    }
  });

  test("opens modal and deletes a movie", async () => {
    findAllMock.mockResolvedValue(moviesMock);
    deleteOneMock.mockResolvedValue();

    render(<AdminPanel />);

    // Ждём, пока фильмы отобразятся
    await waitFor(() => screen.getByText("Movie 1"));

    // Кликаем на delete первого фильма
    fireEvent.click(screen.getAllByText("Delete")[0]);

    // Проверяем, что модалка появилась
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();

    // Подтверждаем удаление
    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(deleteOneMock).toHaveBeenCalledTimes(1);
      expect(deleteOneMock).toHaveBeenCalledWith("1");
      // Проверяем, что фильм удалился из DOM
      expect(screen.queryByText("Movie 1")).not.toBeInTheDocument();
    });
  });

  test("closes modal without deleting when refuse is clicked", async () => {
    findAllMock.mockResolvedValue(moviesMock);

    render(<AdminPanel />);

    await waitFor(() => screen.getByText("Movie 1"));

    fireEvent.click(screen.getAllByText("Delete")[0]);

    fireEvent.click(screen.getByText("No"));

    // Модальное окно должно исчезнуть
    expect(screen.queryByText("Yes")).not.toBeInTheDocument();

    // deleteOne не вызвался
    expect(deleteOneMock).not.toHaveBeenCalled();
  });
});
