

export interface Project {
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

export class Version{
	description: string;
	order: number;
	title: string;
	createdBy?: any;
	deletedAt?: any;
	createdAt?: any;
	modifiedAt?: any;
	id: number;
}
export interface PlanView {
	registerDate: string;
	registerBy: string;
	modifiedAt: string;
	modifiedBy: string;
	id: number;
	title: string;
	description: string;
	project: string;
	projectId: number;
	version: string;
	versionId: number;
	tag:string;
}

export interface Plans {
	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy?: any;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	title: string;
	description: string;
	version: Version;
	project: Project;
	tag:string;
}

export interface PlanResponse {
	page: number;
	pageSize: number;
	count: number;
	message: string;
	success: boolean;
	result: Plans[];
}

export interface PlanCreated {
	projectId: number;
	versionId: number;
	title: string;
	description: string;
	project: Project;
	version: Version;
	createdBy: string;
	deletedAt?: any;
	createdAt: string;
	modifiedAt: string;
	id: number;
}

export interface PlanCreatedResponse {
	message: string;
	success: boolean;
	result: PlanCreated;
}

export interface Project {
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


export interface Plan {
	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	title: string;
	description: string;
	project: Project;
	version: Version;
}

export interface SinglePlanResponse {
	message: string;
	success: boolean;
	result: Plan;
}