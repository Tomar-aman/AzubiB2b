export interface CreateUserRequestDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Define the structure of the JSON input
type CreateUserRequestJson = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

function CreateUserRequestDtoFromJSONTyped(
  json: CreateUserRequestJson
): CreateUserRequestDto {
  return {
    username: json.username,
    email: json.email,
    password: json.password,
    firstName: json.firstName,
    lastName: json.lastName,
  };
}

export function CreateUserRequestDtoFromJSON(
  json: CreateUserRequestJson
): CreateUserRequestDto {
  return CreateUserRequestDtoFromJSONTyped(json);
}
