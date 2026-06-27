export interface UserType {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  _id: string;
  deactivatedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Define the expected JSON structure
type UserResponseJson = {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  deactivatedAt: string;
  createdAt: string;
  updatedAt: string;
};

function CreateUserResponseDtoFromJSONTyped(json: UserResponseJson): UserType {
  return {
    _id: json._id,
    username: json.username,
    email: json.email,
    firstName: json.firstName,
    lastName: json.lastName,
    deactivatedAt: json.deactivatedAt,
    createdAt: json.createdAt,
    updatedAt: json.updatedAt,
  };
}

export function CreateUserResponseDtoFromJSON(
  json: UserResponseJson
): UserType {
  return CreateUserResponseDtoFromJSONTyped(json);
}
