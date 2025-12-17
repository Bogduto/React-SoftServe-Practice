import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditSession from "../../../../components/Admin/EditMovie/EditSession";
import SessionApi from "../../../../api/Sessions";

jest.mock("../../../../api/Sessions");

jest.mock("../../../../components/ModalWrapper", () => ({ children }) => (
  <div data-testid="modal">{children}</div>
));

jest.mock("../../../../components/FormUI", () => ({
  Form: ({ children, onSubmit }) => <form onSubmit={onSubmit}>{children}</form>,
  FieldInput: (props) => <input {...props} />,
  SubmitButton: ({ text }) => <button type="submit">{text}</button>,
  Label: ({ children }) => <label>{children}</label>,
}));

jest.mock("../../../../components/Button", () => (props) => (
  <button {...props} />
));

describe("EditSession", () => {
  const findAllMock = jest.fn();
  const addNewSessionMock = jest.fn();
  const removeSessionMock = jest.fn();

  beforeEach(() => {
    SessionApi.mockReturnValue({
      findAll: findAllMock,
      addNewSession: addNewSessionMock,
      removeSession: removeSessionMock,
      updateSession: jest.fn(),
    });

    findAllMock.mockResolvedValue([]);
  });

  test("renders empty state", async () => {
    render(<EditSession movieId="1" />);

    expect(await screen.findByText("Сесій ще немає.")).toBeInTheDocument();
  });

  test("opens add session modal", async () => {
    render(<EditSession movieId="1" />);

    fireEvent.click(screen.getByText("Додати нову сесію"));

    expect(await screen.findByTestId("modal")).toBeInTheDocument();
  });

  test("removes session", async () => {
    findAllMock.mockResolvedValueOnce([
      { id: "1", date: "2024-01-01", time: "12:00", price: 100, seatsNumber: 50 },
    ]);

    render(<EditSession movieId="1" />);

    fireEvent.click(await screen.findByText("Видалити"));

    await waitFor(() => {
      expect(removeSessionMock).toHaveBeenCalledWith("1");
    });
  });
});
