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
export interface PlanView {
	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	id: number;
	title: string;
	description: string;
	project: string;
	projectId: number;
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
	project: Project;
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
	title: string;
	description: string;
	project: Project;
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
}

export interface SinglePlanResponse {
	message: string;
	success: boolean;
	result: Plan;
}