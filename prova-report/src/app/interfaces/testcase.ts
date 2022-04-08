import { User } from "./users";

export interface TestCase {
	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
  	severity: Severities;
  	priority: Priorities;
	userInCharge: User;
	deletedAt?: any;
	deletedBy?: any;
	lastExecution:number;
    id: number;
    title: string;
    description: string;
    testState: TestState;
    testSuite: TestSuite;
}

export interface TestCaseExecutionResponse{
    message: string;
	success: boolean;
    result: TestExecution;
}
export interface LogMsg{
	level:string;
	timestamp: string;
	description: string;
}
export interface LogStatus{
	endTime:string;
	duration:number;
	startTime:string;
}
export interface Log {
	name:string;
	status: LogStatus;
	library:string;
	msgs: LogMsg[];
}
export interface TestExecutionStep{
	createdAt: string;
    createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	name:string;
	startTime: string;
	endTime: string;
	duration:number
	logs: Log[];
}
export interface TestExecution {
	createdAt: string;
    createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	order: number;
	startTime: string;
	endTime: string;
	comments:string;
	duration:number;
	testState: TestState;
	testExecutionSteps: TestExecutionStep[];
}

export interface TestCaseCreated{
    testSuiteId:number;
    createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
  severity: Severities;
  priority: Priorities;
	deletedAt?: any;
    id: number;
    title: string;
    description: string;
    testState: TestState;
    testSuite: TestSuite;
}
export interface TestCaseCreatedResponse{
    message: string;
	success: boolean;
    result: TestCaseCreated
}

export interface TestSuite{
    createdAt:string;
    createdBy: string;
    modifiedAt: string;
    modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
    id: number,
    title: string,
    description: string
}
export interface TestState {
	id: number;
	name: string;
}

export interface SingleTestCaseResponse{
    message: string;
	success: boolean;
	result: TestCase;
}

export interface TestCaseResponse {
	page: number;
	pageSize: number;
	count: number;
	message: string;
	success: boolean;
  severity: Severities;
  priority: Priorities;
	result: TestCase[];
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
