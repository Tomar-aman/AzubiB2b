export interface TokenResponseDto {
  token: string;
}

// Define a more specific type for the input JSON
type TokenJson = {
  token: string;
};

export function TokenResponseDtoFromJSON(json: TokenJson): TokenResponseDto {
  return TokenResponseDtoFromJSONTyped(json);
}

export function TokenResponseDtoFromJSONTyped(
  json: TokenJson,
): TokenResponseDto {
  if (json === undefined || json === null) {
    throw new Error("Invalid JSON input"); // Handle unexpected inputs explicitly
  }
  return {
    token: json.token,
  };
}

export function TokensResponseDtoToJSON(
  value?: TokenResponseDto | null,
): TokenJson | undefined | null {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    token: value.token,
  };
}
