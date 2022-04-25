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
export interface SuiteView {
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

export interface Suites {
	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy?: any;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	tag: string;
	title: string;
	description: string;
	project: Project;
}

export interface SuiteResponse {
	page: number;
	pageSize: number;
	count: number;
	message: string;
	success: boolean;
	result: Suites[];
}


export interface TestState {
	id: number;
	name: string;
}

export interface SuiteCreated {
	projectId: number;
	title: string;
	description: string;
	project: Project;
	testState: TestState;
	createdBy: string;
	deletedAt?: any;
	createdAt: string;
	modifiedAt: string;
	id: number;
}

export interface SuiteCreatedResponse {
	message: string;
	success: boolean;
	result: SuiteCreated;
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

export interface TestState {
	id: number;
	name: string;
}

export interface Suite {
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
	testState: TestState;
}

export interface SingleSuiteResponse {
	message: string;
	success: boolean;
	result: Suite;
}