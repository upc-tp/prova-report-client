export class Dashboard{
    testsBySeverity: TestsBySeverity[];
    testsByStatus: Status[];
    testsByPriority: TestsByPriority[];
}

export class TestsBySeverity{
    id: number;
    name: string;
    num_tests: number;
    statuses: Status[];
}

export class TestsByPriority{
    id: number;
    name: string;
    num_tests: number;
    statuses: Status[];
}

export class Status{
    id: number;
    name: string;
    num_tests: number;
}

export class DashboardResponse{
    message: string;
    success: boolean;
    result: Dashboard;
}