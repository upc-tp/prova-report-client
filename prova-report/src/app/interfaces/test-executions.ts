
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
	duration:string;
	testState: TestState;
	testExecutionSteps: TestExecutionStep[];
    testCase: TestCaseExecution;
}

export interface SingleTestExecutionResponse{
    message: string;
	success: boolean;
    result: TestExecution;
}

export interface TestCaseExecution{
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
    lastExecution: number;
}

export interface TestState {
	id: number;
	name: string;
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

export interface Log {
	name:string;
	status: LogStatus;
	library:string;
	msgs: LogMsg[];
}

export interface LogStatus{
	endTime:string;
	duration:number;
	startTime:string;
}
export interface LogMsg{
	level:string;
	timestamp: string;
	description: string;
}