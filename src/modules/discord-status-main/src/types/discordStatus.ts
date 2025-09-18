export type getStatusResult =
| {
    status: "success";
    period: {
        count: number;
        interval: number;
        identifier: string;
    };
    metrics: [
        {
            metric: {
                name: string;
                metric_identifier: string;
                created_at: string;
                updated_at: string;
                id: string;
                metrics_provider_id: string;
                metrics_display_id: string
                backfilled: boolean;
                last_fetched_at: string;
                backfill_percentage: number;
            };
            summary: {
                sum: number;
                mean: number;
            };
            data: [
                {
                    timestamp: number;
                    value: number;
                }
            ];
        }
    ];
} | {
    status: "error";
    message: string;
}