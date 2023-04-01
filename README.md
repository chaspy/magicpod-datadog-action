# magicpod-datadog-action

This is an action to send metrics of MagicPod to Datadog.

## Usage

```
      - name: Run magicpod-datadog-action
        uses: chaspy/magicpod-datadog-action@main
        with:
          magicpod_api_token: ${{ secrets.MAGICPOD_API_TOKEN }}
          magicpod_organization_name: ${{ secrets.MAGICPOD_ORGANIZATION_NAME}}
          magicpod_project_name: ${{ secrets.MAGICPOD_PROJECT_NAME}}
        env:
          DD_API_KEY: ${{ secrets.DD_API_KEY }}
```

## Environment variables

| Name       | Description                                                                    | Required |
| ---------- | ------------------------------------------------------------------------------ | -------- |
| DD_API_KEY | [Datadog API Key](https://docs.datadoghq.com/account_management/api-app-keys/) | Yes      |

## Inputs

| Name                       | Description                                                        | Required |
| -------------------------- | ------------------------------------------------------------------ | -------- |
| magicpod_api_token         | [MagicPod API Token](https://app.magicpod.com/accounts/api-token/) | yes      |
| magicpod_organization_name | MagicPod Organization Name                                         | Yes      |
| magicpod_project_name      | MagicPod Project Name                                              | Yes      |

## Metrics

| Name                                                       | Description                                                                              | Type  | Unit   | Tag                                               |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----- | ------ | ------------------------------------------------- |
| `custom.magicpod_datadog_action.batch_run.duration_second` | Time taken to execute the Batch Run. (Difference between `finished_at` and `started_at`) | Gauge | Second | `batch_run_number`, `status`, `test_setting_name` |

## Supported Tags

`batch_run_number`, `status`, `test_setting_name`, `organization_name`, `project_name`

See [API Document](https://magic-pod.com/api/v1.0/doc/) for the details. (Models / BatchRun Section)

The action uses GET `/v1.0/batch_runs` API.

## Known Limitation

The Datadog [Submit Metrics API](https://docs.datadoghq.com/api/latest/metrics/?code-lang=typescript#submit-metrics) cannot accept timestamps more than one hour in the past. Therefore, at least, this job must be run within an hour of the most recent test run. It is recommended to run this job once every 20 minutes, as multiple runs will not duplicate metrics.
