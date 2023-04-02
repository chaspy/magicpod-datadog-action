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
