export class TestCase {
	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
    id: number;
    title: string;
    description: string;
    testState: TestState;
    testSuite: TestSuite;
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
