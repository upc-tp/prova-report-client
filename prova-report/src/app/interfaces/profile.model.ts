export interface ResetPassword {
	oldPassword: string;
	newPassword: string;
}

export interface LoginCredentials {
  accessToken: string;
  refreshToken: string;
}

export interface ResetPasswordResponse {
	message: string;
	success: boolean;
	result?: LoginCredentials;
}