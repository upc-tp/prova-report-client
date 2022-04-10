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

export interface SingleProjectResponse {
	message: string;
	success: boolean;
	result: Project;
}

export interface Collaborator {
    uid: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
	password: string;
}

export interface CollaboratorsResponse {
    page: number;
    pageSize: number;
    count: number;
    message: string;
    success: string;
    result: Collaborator[];
}

export interface CollaboratorCreated {
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	password: string;
	id: number;
}

export interface CollaboratorCreatedResponse {
	message: string;
	success: boolean;
	result: CollaboratorCreated;
}
