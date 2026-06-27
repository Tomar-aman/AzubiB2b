export interface AccessTokensResponseDto {
  accessToken: string;
  refreshToken: string;
}

// Define a more specific type for the input JSON
type AccessTokensJson = {
  accessToken: string;
  refreshToken: string;
};

export function AccessTokensResponseDtoFromJSON(
  json: AccessTokensJson
): AccessTokensResponseDto {
  return AccessTokensResponseDtoFromJSONTyped(json);
}

export function AccessTokensResponseDtoFromJSONTyped(
  json: AccessTokensJson
): AccessTokensResponseDto {
  if (json === undefined || json === null) {
    throw new Error("Invalid JSON input"); // Handle unexpected inputs explicitly
  }
  return {
    accessToken: json.accessToken,
    refreshToken: json.refreshToken,
  };
}

export function AccessTokensResponseDtoToJSON(
  value?: AccessTokensResponseDto | null
): AccessTokensJson | undefined | null {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    accessToken: value.accessToken,
    refreshToken: value.refreshToken,
  };
}
