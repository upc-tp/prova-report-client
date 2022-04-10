
export interface Defect {
    createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
  	severity: Severities;
  	priority: Priorities;
    deletedAt?: any;
	deletedBy?: any;
    id: number;
    title: string;
    repro_steps: string;
    is_fixed: number;
    defectState: DefectState;
    testCase: TestCase;
    testExecution: TestExecution;
}
export interface DefectResponse {
	page: number;
	pageSize: number;
	count: number;
	message: string;
	success: boolean;
  severity: Severities;
  priority: Priorities;
	result: Defect[];
}

export interface Severities {
	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	name: string;
}

export interface Priorities {
	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	name: string;
}

export interface DefectState {
	id: number;
	name: string;
}

export interface TestCase {
    createdAt:string;
    createdBy: string;
    modifiedAt: string;
    modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
    id: number;
    title: string;
    description: string
}

export interface TestExecution {
    createdAt:string;
    createdBy: string;
    modifiedAt: string;
    modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
    id: number;
    comments: string;
    order: number;
    duration: number;
}

export interface DefectData {
	id: number;
	title: string;
	repro_steps: string;
	
}