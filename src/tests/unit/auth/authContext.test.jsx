import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import AuthProvider, { AuthContext } from "../../../context/AuthContext";
import Cookies from "js-cookie";
import { supabase } from "../../../supabaseClient";

// Мокаємо клієнт Supabase
jest.mock("../../../supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      // За замовчуванням сесії немає
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
      }),
      // Мокаємо підписку на зміну стану авторизації
      onAuthStateChange: jest.fn().mockReturnValue({ data: null }),
    },
    // Мокаємо запити до таблиць
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: { user_id: "123" },
      error: null,
    }),
    insert: jest.fn().mockResolvedValue({ error: null }),
  },
}));

// Мокаємо роботу з cookies
jest.mock("js-cookie", () => ({
  set: jest.fn(),
  remove: jest.fn(),
}));

describe("AuthProvider", () => {
  test("initial state is unauthenticated", async () => {
    // Рендеримо AuthProvider та читаємо значення контексту
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ status, isAuthenticated }) => (
            <div>
              <span>{status}</span>
              <span>{isAuthenticated ? "yes" : "no"}</span>
            </div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Перевіряємо початковий стан авторизації
    await waitFor(() => {
      expect(
        screen.getByText("unauthenticated")
      ).toBeInTheDocument();
      expect(screen.getByText("no")).toBeInTheDocument();
    });
  });

  test("login sets user and status correctly", async () => {
    // Фейковий користувач
    const fakeUser = { id: "1", email: "test@test.com" };

    // Мокаємо успішний логін через Supabase
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: {
        user: fakeUser,
        session: {
          access_token: "access",
          refresh_token: "refresh",
        },
      },
      error: null,
    });

    let contextValue;

    // Отримуємо доступ до методів контексту
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Викликаємо логін (обгортаємо в act)
    await act(async () => {
      const result = await contextValue.login({
        usernameOrEmail: "test@test.com",
        password: "pass",
      });

      // Перевіряємо результат логіну
      expect(result.success).toBe(true);
    });

    // Перевіряємо стан після успішної авторизації
    await waitFor(() => {
      expect(contextValue.user).toEqual(fakeUser);
      expect(contextValue.status).toBe("authorized");
      expect(contextValue.isAuthenticated).toBe(true);

      // Перевіряємо, що токени збережені в cookies
      expect(Cookies.set).toHaveBeenCalledWith(
        "access_token",
        "access",
        { expires: 1 }
      );
      expect(Cookies.set).toHaveBeenCalledWith(
        "refresh_token",
        "refresh",
        { expires: 30 }
      );
    });
  });

  test("logout resets user and status", async () => {
    let contextValue;

    // Рендеримо провайдер та отримуємо доступ до контексту
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Викликаємо logout
    await act(async () => {
      await contextValue.logout();
    });

    // Перевіряємо, що стан скинувся
    await waitFor(() => {
      expect(contextValue.user).toBe(null);
      expect(contextValue.status).toBe("unauthenticated");
      expect(contextValue.isAuthenticated).toBe(false);

      // Перевіряємо, що cookies були видалені
      expect(Cookies.remove).toHaveBeenCalledWith("access_token");
      expect(Cookies.remove).toHaveBeenCalledWith("refresh_token");
    });
  });
});
