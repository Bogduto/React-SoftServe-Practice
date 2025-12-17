// // AddMovieForm.test.js
// import { render, screen, fireEvent } from "@testing-library/react";
// import { useNavigate } from "react-router-dom";
// import { AddMovieForm } from "../../../../components/Admin/AddMovie";

// // Мокаем useNavigate
// jest.mock("react-router-dom", () => ({
//   useNavigate: jest.fn(),
// }));

// jest.mock("../../../../components/FormUI/index", () => ({
//   FieldInput: ({ id, placeholder, ...props }) => (
//     <input data-testid={id} placeholder={placeholder} {...props} />
//   ),
//   FieldTextarea: ({ id, placeholder, ...props }) => (
//     <textarea data-testid={id} placeholder={placeholder} {...props} />
//   ),
//   FieldArray: ({ items, onAdd, onRemove }) => (
//     <div data-testid="field-array">
//       {items.map((item, idx) => (
//         <div key={idx}>
//           <span>{item}</span>
//           <button onClick={() => onRemove(idx)}>Remove</button>
//         </div>
//       ))}
//       <button onClick={() => onAdd("Action")}>Add Genre</button>
//     </div>
//   ),
//   FieldRow: ({ children }) => <div>{children}</div>,
//   SubmitButton: ({ text }) => <button type="submit">{text}</button>,
// }));

// jest.mock("../../../../components/Admin/Forms/index", () => ({
//   MovieForm: ({ children, handleSubmit }) => (
//     <form onSubmit={handleSubmit}>{children}</form>
//   ),
// }));



// describe("AddMovieForm", () => {
//   const mockNavigate = jest.fn();

//   beforeEach(() => {
//     useNavigate.mockReturnValue(mockNavigate);
//   });

//   it("рендерит все поля формы", () => {
//     render(<AddMovieForm />);

//     const fields = [
//       "poster",
//       "title",
//       "description",
//       "trailerLink",
//       "releaseDate",
//       "country",
//       "duration",
//       "ageRestriction",
//       "imdb",
//       "rottenTomatoes",
//     ];

//     fields.forEach((id) => {
//       expect(screen.getByTestId(id)).toBeInTheDocument();
//     });

//     expect(screen.getByTestId("field-array")).toBeInTheDocument();
//     expect(screen.getByText("Додати фільм")).toBeInTheDocument();
//   });

//   it("можно добавить и удалить жанр", () => {
//     render(<AddMovieForm />);
    
//     // Добавляем жанр
//     fireEvent.click(screen.getByText("Add Genre"));
//     expect(screen.getByText("Action")).toBeInTheDocument();

//     // Удаляем жанр
//     fireEvent.click(screen.getByText("Remove"));
//     expect(screen.queryByText("Action")).not.toBeInTheDocument();
//   });

//   it("вызывает onSubmit при отправке формы", () => {
//     render(<AddMovieForm />);
    
//     const submitButton = screen.getByText("Додати фільм");
//     fireEvent.click(submitButton);

//     expect(submitButton).toBeEnabled();
//   });
// });
