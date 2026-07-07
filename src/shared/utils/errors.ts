/**
 * AppError — Hierarquia de erros tipados da aplicação.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = "UNKNOWN",
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class RepositoryError extends AppError {
  constructor(message: string) {
    super(message, "REPOSITORY_ERROR");
    this.name = "RepositoryError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Erro de conexão. Verifique sua rede.") {
    super(message, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocorreu um erro inesperado. Tente novamente.";
}
