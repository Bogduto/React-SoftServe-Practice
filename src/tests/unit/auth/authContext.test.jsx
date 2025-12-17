import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import AuthProvider, { AuthContext } from "../../../context/AuthContext";
import Cookies from "js-cookie";
import { supabase } from "../../../supabaseClient";

// Мок для supabase
jest.mock("../../../supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({ data: null }),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { user_id: "123" }, error: null }),
    insert: jest.fn().mockResolvedValue({ error: null }),
  },
}));

jest.mock("js-cookie", () => ({
  set: jest.fn(),
  remove: jest.fn(),
}));

describe("AuthProvider", () => {
  test("initial state is unauthenticated", async () => {
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

    await waitFor(() => {
      expect(screen.getByText("unauthenticated")).toBeInTheDocument();
      expect(screen.getByText("no")).toBeInTheDocument();
    });
  });

  test("login sets user and status correctly", async () => {
    const fakeUser = { id: "1", email: "test@test.com" };
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: fakeUser, session: { access_token: "access", refresh_token: "refresh" } },
      error: null,
    });

    let contextValue;
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

    // Логин оборачиваем в act
    await act(async () => {
      const result = await contextValue.login({
        usernameOrEmail: "test@test.com",
        password: "pass",
      });

      expect(result.success).toBe(true);
    });

    // Проверяем состояние после логина
    await waitFor(() => {
      expect(contextValue.user).toEqual(fakeUser);
      expect(contextValue.status).toBe("authorized");
      expect(contextValue.isAuthenticated).toBe(true);
      expect(Cookies.set).toHaveBeenCalledWith("access_token", "access", { expires: 1 });
      expect(Cookies.set).toHaveBeenCalledWith("refresh_token", "refresh", { expires: 30 });
    });
  });

  test("logout resets user and status", async () => {
    let contextValue;
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

    await act(async () => {
      await contextValue.logout();
    });

    await waitFor(() => {
      expect(contextValue.user).toBe(null);
      expect(contextValue.status).toBe("unauthenticated");
      expect(contextValue.isAuthenticated).toBe(false);
      expect(Cookies.remove).toHaveBeenCalledWith("access_token");
      expect(Cookies.remove).toHaveBeenCalledWith("refresh_token");
    });
  });
});
