export interface Projects {
	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	title: string;
	description: string;
}

export interface ProjectsResponse {
	page: number;
	pageSize: number;
	count: number;
	message: string;
	success: boolean;
	result: Projects[];
}

export interface ProjectCreated {
	title: string;
	description: string;
	createdBy: string;
	deletedAt?: any;
	createdAt: string;
	modifiedAt: string;
	id: number;
}

export interface ProjectCreatedResponse {
	message: string;
	success: boolean;
	result: ProjectCreated;
}