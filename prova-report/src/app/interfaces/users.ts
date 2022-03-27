
export interface User {
    uid: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    iat: number;
    exp: number;
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
	message: string;
	success: boolean;
	result?: LoginCredentials;
}

export interface LoginCredentials {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface CollaboratorsResponse {
    page: number;
    pageSize: number;
    count: number;
    message: string;
    success: string;
    result: User[];
}