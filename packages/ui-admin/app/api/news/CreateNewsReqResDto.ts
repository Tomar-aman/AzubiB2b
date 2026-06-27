export interface CreateNewsRequestDto {
    title: string;
    description: string;
    images: string[];
}

export interface News {
    _id: string;
    title: string;
    description: string;
    images: string[];
}

export interface UpdateNews {
    companyId?: string;
    title: string;
    description: string;
    images: string[];
}