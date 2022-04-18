import { Project } from "./suites";

export interface UserStory{
	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	name: string;
	description: string;
    project: Project;
    userStoryCriterias: UserStoryCriteria[];
}

export interface UserStoryCreated{
	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	name: string;
	description: string;
    project: Project;
    projectId: number;
    userStoryCriterias: UserStoryCriteria[];
}

export interface UserStoryCreatedResponse{
	message: string;
	success: boolean;
	result: UserStoryCreated;
}

export interface UserStoryCriteria{
 	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	description: string;
}


export interface UserStoryCriteriaCreated{
 	createdAt: string;
	createdBy: string;
	modifiedAt: string;
	modifiedBy: string;
	deletedAt?: any;
	deletedBy?: any;
	id: number;
	description: string;
    userStory: UserStory;
    userStoryId: number;
}

export interface UserStoryCriteriaCreatedResponse{
	message: string;
	success: boolean;
	result: UserStoryCriteriaCreated;
}

export interface UserStoryResponse {
	page: number;
	pageSize: number;
	count: number;
	message: string;
	success: boolean;
	result: UserStory[];
}

export interface SingleUserStoryResponse {
	message: string;
	success: boolean;
	result: UserStory[];
}
