# Cloud Monitoring Configuration

## Enable Required APIs

```powershell
gcloud services enable monitoring.googleapis.com --project=rivoct-sandbox
gcloud services enable logging.googleapis.com --project=rivoct-sandbox
gcloud services enable cloudtrace.googleapis.com --project=rivoct-sandbox
```

## Create Log-Based Metrics

### Voice OTP Success Rate
```powershell
gcloud logging metrics create voice_otp_success_rate `
  --description="Success rate of voice OTP calls" `
  --log-filter='resource.type="cloud_run_revision" 
    AND jsonPayload.status="answered"' `
  --value-extractor='EXTRACT(jsonPayload.status)' `
  --metric-kind=DELTA `
  --project=rivoct-sandbox
```

### API Request Count
```powershell
gcloud logging metrics create api_request_count `
  --description="Total API requests" `
  --log-filter='resource.type="cloud_run_revision" 
    AND httpRequest.requestUrl=~"/v1/*"' `
  --project=rivoct-sandbox
```

### Webhook Delivery Rate
```powershell
gcloud logging metrics create webhook_delivery_rate `
  --description="Webhook delivery status updates" `
  --log-filter='resource.type="cloud_run_revision" 
    AND resource.labels.service_name="mcm-webhook"
    AND httpRequest.status=202' `
  --project=rivoct-sandbox
```

## Create Alerting Policies

### High Error Rate Alert
```powershell
gcloud alpha monitoring policies create `
  --notification-channels=CHANNEL_ID `
  --display-name="High Error Rate - Voice OTP API" `
  --condition-display-name="Error rate > 10%" `
  --condition-threshold-value=0.1 `
  --condition-threshold-duration=300s `
  --project=rivoct-sandbox
```

### Service Downtime Alert
```powershell
gcloud alpha monitoring policies create `
  --notification-channels=CHANNEL_ID `
  --display-name="Service Downtime - Webhook" `
  --condition-display-name="Uptime check failed" `
  --project=rivoct-sandbox
```

## Configure Uptime Checks

### Webhook Service Uptime
```powershell
gcloud monitoring uptime create webhook-health-check `
  --resource-type=uptime-url `
  --resource-labels=host=mcm-webhook-663012819768.asia-south1.run.app,project_id=rivoct-sandbox `
  --http-check-path=/health `
  --period=300 `
  --timeout=10s `
  --project=rivoct-sandbox
```

### API Service Uptime
```powershell
gcloud monitoring uptime create api-health-check `
  --resource-type=uptime-url `
  --resource-labels=host=api-663012819768.asia-south1.run.app,project_id=rivoct-sandbox `
  --http-check-path=/health `
  --period=300 `
  --timeout=10s `
  --project=rivoct-sandbox
```

## Dashboard Configuration

### Create Custom Dashboard
1. Go to Cloud Console: https://console.cloud.google.com/monitoring/dashboards
2. Click "Create Dashboard"
3. Add charts:
   - **API Request Rate**: Line chart showing requests/minute
   - **Voice OTP Success Rate**: Percentage gauge
   - **Response Latency**: Heatmap of p50, p95, p99
   - **Error Rate**: Stacked area chart by error type
   - **Cost Tracking**: Total billed amount over time

### Import Dashboard JSON
```json
{
  "displayName": "Rivoct Voice OTP Dashboard",
  "mosaicLayout": {
    "columns": 12,
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "API Request Rate",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" resource.labels.service_name=\"api\"",
                  "aggregation": {
                    "perSeriesAligner": "ALIGN_RATE",
                    "crossSeriesReducer": "REDUCE_SUM"
                  }
                }
              }
            }]
          }
        }
      }
    ]
  }
}
```

## Log Analysis Queries

### Find Failed OTP Calls
```
resource.type="cloud_run_revision"
resource.labels.service_name="api"
jsonPayload.status="failed"
```

### Track High-Cost Customers
```
resource.type="cloud_run_revision"
jsonPayload.billedAmountInr>10
```

### Monitor Rate Limit Hits
```
resource.type="cloud_run_revision"
httpRequest.status=429
```

## Notification Channels

### Email Notifications
```powershell
gcloud alpha monitoring channels create `
  --display-name="Admin Email" `
  --type=email `
  --channel-labels=email_address=admin@rivoct.com `
  --project=rivoct-sandbox
```

### Slack Notifications (Optional)
```powershell
gcloud alpha monitoring channels create `
  --display-name="Slack Alerts" `
  --type=slack `
  --channel-labels=url=https://hooks.slack.com/services/YOUR/WEBHOOK/URL `
  --project=rivoct-sandbox
```

## Cost Monitoring

### Budget Alert
```powershell
gcloud billing budgets create `
  --billing-account=BILLING_ACCOUNT_ID `
  --display-name="Voice OTP Monthly Budget" `
  --budget-amount=1000INR `
  --threshold-rule=percent=50 `
  --threshold-rule=percent=90 `
  --threshold-rule=percent=100 `
  --project=rivoct-sandbox
```

## Logging Best Practices

### Structured Logging Example
```typescript
console.log(JSON.stringify({
  severity: 'INFO',
  message: 'Voice OTP sent',
  customerId: 'cust_123',
  requestId: 'req_456',
  status: 'answered',
  durationSeconds: 45,
  billedAmountInr: 0.32,
  timestamp: new Date().toISOString()
}));
```

### Error Logging
```typescript
console.error(JSON.stringify({
  severity: 'ERROR',
  message: 'API key validation failed',
  error: error.message,
  stack: error.stack,
  customerId: 'cust_123',
  timestamp: new Date().toISOString()
}));
```

## Access Monitoring Dashboard

- Console: https://console.cloud.google.com/monitoring/dashboards?project=rivoct-sandbox
- Logs Explorer: https://console.cloud.google.com/logs?project=rivoct-sandbox
- Trace: https://console.cloud.google.com/traces?project=rivoct-sandbox
- Metrics: https://console.cloud.google.com/monitoring/metrics-explorer?project=rivoct-sandbox

## Next Steps

1. Enable monitoring APIs
2. Create log-based metrics
3. Set up uptime checks
4. Configure alerting policies
5. Create custom dashboard
6. Add notification channels
7. Set up budget alerts
