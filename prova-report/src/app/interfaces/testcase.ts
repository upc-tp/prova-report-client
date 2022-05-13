import { User } from "./users";
import { UserStoryCriteria } from "./userstory";

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
	tag: string;
    title: string;
    description: string;
    testState: TestState;
    testSuite: TestSuite;
	userStoryCriteria: UserStoryCriteria;
}

export class TestCaseSelected {
	registerDate: string;
	registerBy: string;
	modifiedAt: string;
	modifiedBy: string;
	testStatus: string;
  	severity: Severities;
  	priority: Priorities;
	userInCharge: User;
	deletedAt?: any;
	deletedBy?: any;
	lastExecution:number;
    id: number;
	tag: string;
    title: string;
    description: string;
    testState: TestState;
    testSuite: TestSuite;
	userStoryCriteria: UserStoryCriteria;
	severityIcon: string;
	priorityIcon: string;
}

export interface TestCaseView {
	createdAt: string;
	description: string;
	title: string;
	id: number;
	lastExecution: number;
	userInCharge: string;
}

export interface TestExecutionResponse{
    message: string;
	success: boolean;
    result: TestExecution[];
	page:number;
	pageSize:number;
	count:number;
}

export interface SingleTestExecutionResponse{
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
	testState: TestState;
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
