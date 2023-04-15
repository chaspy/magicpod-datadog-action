# magicpod-datadog-action

This is an action to send metrics of MagicPod to Datadog.

## Usage

```yaml
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

| Name                       | Description                                                                      | Required | Default |
| -------------------------- | -------------------------------------------------------------------------------- | -------- | ------- |
| magicpod_api_token         | [MagicPod API Token](https://app.magicpod.com/accounts/api-token/)               | Yes      |         |
| magicpod_organization_name | MagicPod Organization Name                                                       | Yes      |         |
| magicpod_project_name      | MagicPod Project Name                                                            | Yes      |         |
| magicpod_record_count      | `count` query parameter of [BatchRuns API](https://magic-pod.com/api/v1.0/doc/). | No       | 20      |

## Metrics

| Name                                                       | Description                                                                              | Type  | Unit   |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----- | ------ |
| `custom.magicpod_datadog_action.batch_run.duration_second` | Time taken to execute the Batch Run. (Difference between `finished_at` and `started_at`) | Gauge | Second |
| `custom.magicpod_datadog_action.batch_run.count`           | Whether the Batch Run was run or not. always send 1 for started_at.                      | Gauge | Count  |

| `custom.magicpod_datadog_action.test_case.duration_second` | Time taken to execute each test case. (Difference between `finished_at` and `started_at`) | Gauge | Second |
| `custom.magicpod_datadog_action.test_case.count` | Whether the test case was run or not. always send 1 for started_at. | Gauge | Count |

## Supported Tags

- Batch Runs API: `batch_run_number`, `status`, `test_setting_name`, `organization_name`, `project_name`
- Batch Run API: `batch_run_number`, `status`, `test_setting_name`, `organization_name`, `project_name`, `pattern_name`, `order`, `number`

See [API Document](https://magic-pod.com/api/v1.0/doc/) for the details. (Models / BatchRun Section)

The action uses GET `/v1.0/batch_runs` API.

## Known Limitation

The Datadog [Submit Metrics API](https://docs.datadoghq.com/api/latest/metrics/?code-lang=typescript#submit-metrics) cannot accept timestamps more than one hour in the past. Therefore, at least, this job must be run within an hour of the most recent test run. It is recommended to run this job once every 20 minutes, as multiple runs will not duplicate metrics.

## How to test

See [chaspy/magicpod-datadog-action-test](https://github.com/chaspy/magicpod-datadog-action-test)
