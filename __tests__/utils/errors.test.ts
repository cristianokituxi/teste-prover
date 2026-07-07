import {
  AppError,
  ValidationError,
  RepositoryError,
  NetworkError,
  getFriendlyErrorMessage,
} from "@/src/shared/utils/errors";

describe("AppError hierarchy", () => {
  it("creates base AppError", () => {
    const err = new AppError("Something went wrong");
    expect(err.message).toBe("Something went wrong");
    expect(err.code).toBe("UNKNOWN");
    expect(err.name).toBe("AppError");
  });

  it("creates AppError with custom code", () => {
    const err = new AppError("Custom", "CUSTOM");
    expect(err.code).toBe("CUSTOM");
  });

  it("creates ValidationError", () => {
    const err = new ValidationError("Invalid data");
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err).toBeInstanceOf(AppError);
  });

  it("creates RepositoryError", () => {
    const err = new RepositoryError("DB error");
    expect(err.code).toBe("REPOSITORY_ERROR");
    expect(err).toBeInstanceOf(AppError);
  });

  it("creates NetworkError with default message", () => {
    const err = new NetworkError();
    expect(err.message).toContain("conexão");
    expect(err.code).toBe("NETWORK_ERROR");
  });

  it("creates NetworkError with custom message", () => {
    const err = new NetworkError("Timeout");
    expect(err.message).toBe("Timeout");
  });
});

describe("getFriendlyErrorMessage", () => {
  it("returns AppError message for AppError instances", () => {
    expect(getFriendlyErrorMessage(new AppError("Oops"))).toBe("Oops");
  });

  it("returns Error message for regular Error instances", () => {
    expect(getFriendlyErrorMessage(new Error("Regular error"))).toBe("Regular error");
  });

  it("returns default message for unknown errors", () => {
    expect(getFriendlyErrorMessage(null)).toBe("Ocorreu um erro inesperado. Tente novamente.");
  });
});
