import { TestExecutionStep } from "src/app/interfaces/testcase";

export class TestCase {
	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
    id: number;
	tag: string;
    title: string;
    description: string;
    priority: Priorities;
    severity: Severities;
    testState: TestState;
    testSuite: TestSuite;
	userInCharge: userInCharge;
	lastExecution: number;
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

export class TestState {
	id: number;
	name: string;
}

export class TestSuite{
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

export class userInCharge{
	firstName: string;
	lastName: string;
}

export class TestCaseSteps{
	id:number;
	testState: TestState
	name:string;
	start_time:string;
	end_time:string;
	duration:number;
	created_at:string;
	created_by:string;
}

export class TestExecutionDetail{
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