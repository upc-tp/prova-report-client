export interface Versions {
	projectId: string;
	description: string;
	order: number;
	title: string;
	createdBy?: any;
	deletedAt?: any;
	createdAt?: any;
	modifiedAt?: any;
	id: number;
	project: Project;
}

export interface VersionsResponse {
	page: number;
	pageSize: number;
	count: number;
	message: string;
	success: boolean;
	result: Versions[];
}

export interface DeleteVersionResponse{
	message:string;
	success:string;
}

export interface Project {
	createdAt: string;
	createdBy?: any;
	modifiedAt: string;
	modifiedBy?: any;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	title: string;
	description: string;
}

export interface VersionCreated {
	projectId: number;
	description: string;
	title: string;
}

export interface VersionsCreatedResponse {
	message: string;
	success: boolean;
	result: VersionCreated[];
}
