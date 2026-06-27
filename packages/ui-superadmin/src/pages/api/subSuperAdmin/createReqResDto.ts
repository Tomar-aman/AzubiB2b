export interface CreateRequestDto {
    firstName: string,
    lastName: string,
    email: string,
    password: string
    role: string
    managePolicy: boolean;
    manageImpressum: boolean;
    manageMeineDaten: boolean;
    manageJobAlarmContent: boolean;
    manageJobFormContent: boolean;
}

export interface SubSuperAdminType {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    managePolicy: boolean;
    manageImpressum: boolean;
    manageMeineDaten: boolean;
    manageJobAlarmContent: boolean;
    manageJobFormContent: boolean;
    createdAt: string;
    updatedAt: string;
};

type CreateRequestJson = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
    managePolicy: boolean,
    manageImpressum: boolean,
    manageMeineDaten: boolean,
    manageJobAlarmContent: boolean,
    manageJobFormContent: boolean,
};

type CreateResponseJson = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    managePolicy: boolean;
    manageImpressum: boolean;
    manageMeineDaten: boolean;
    manageJobAlarmContent: boolean;
    manageJobFormContent: boolean;
    createdAt: string;
    updatedAt: string;
};

function CreateRequestDtoFromJSONTyped(
    json: CreateRequestJson
): CreateRequestDto {
    return {
        firstName: json.firstName,
        lastName: json.lastName,
        email: json.email,
        password: json.password,
        role: json.role,
        managePolicy: json.managePolicy,
        manageImpressum: json.manageImpressum,
        manageMeineDaten: json.manageMeineDaten,
        manageJobAlarmContent: json.manageJobAlarmContent,
        manageJobFormContent: json.manageJobFormContent,
    }
};

function CreateResponseDtoFromJSONTyped(
    json: CreateResponseJson
): SubSuperAdminType {
    return {
        _id: json._id,
        firstName: json.firstName,
        lastName: json.lastName,
        email: json.email,
        role: json.role,
        managePolicy: json.managePolicy,
        manageImpressum: json.manageImpressum,
        manageMeineDaten: json.manageMeineDaten,
        manageJobAlarmContent: json.manageJobAlarmContent,
        manageJobFormContent: json.manageJobFormContent,
        createdAt: json.createdAt,
        updatedAt: json.updatedAt,
    };
}

export function CreateResponseDtoFromJSON(
    json: CreateResponseJson
): SubSuperAdminType {
    return CreateResponseDtoFromJSONTyped(json);
}