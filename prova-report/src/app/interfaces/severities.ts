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

export interface SeveritiesResponse {
	page: number;
	pageSize: number;
	count: number;
	message: string;
	success: boolean;
	result: Severities[];
}
