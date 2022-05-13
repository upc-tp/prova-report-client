
export interface Defect {
  	tag: any;
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

export interface DefectView {
	id: number;
	title: string;
	repro_steps: string;
	severity: string;
	severityId: number;
	severityIcon: string;
	priority: string;
	priorityId: number;
	priorityIcon: string;
	testPlan:string;
	testSuite:string;
	testCase:string;
	tag:string;
	state:string;
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
	tag:string;
    title: string;
    description: string;
	lastExecution: number;
	testSuite: TestSuiteDef;
}

export interface TestSuiteDef{
	createdAt:string;
    createdBy: string;
    modifiedAt: string;
    modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
	id:number;
	tag: string;
	title:string;
	description:string;
	testPlan: TestPlanDef;
}

export interface TestPlanDef{
	createdAt:string;
    createdBy: string;
    modifiedAt: string;
    modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
	id:number;
	tag:string;
	title:string;
	description:string;
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

export interface SingleDefectResponse {
	message: string;
	success: boolean;
	result: Defect;
}
export interface Severity {
	id: number;
	name: string;
}

export interface Priority {
	id: number;
	name: string;
}
export interface DefectCreated {
	severityId: number;
	severity: Severity;
	priorityId: number;
	priority: Priority;
	title: string;
	repro_steps: string;
	is_fixed: number;
	defectState: DefectState;
	testCase: TestCase;
	testExecution: TestExecution;
	createdBy: string;
	deletedAt?: any;
	createdAt: string;
	modifiedAt: string;
}
export interface DefectCreatedResponse {
	message: string;
	success: boolean;
	result: DefectCreated;
}