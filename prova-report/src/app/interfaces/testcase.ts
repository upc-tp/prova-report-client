export interface TestCase {
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
    description: string;
    testState: TestState;
    testSuite: TestSuite;
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
