<#
PowerShell dry-run script to generate gcloud IAM commands per GCS bucket.
This script reads `tools/monte-audit/audit-latest/copilot-audit-buckets.json` and
prints safe `gcloud` commands to stdout and to `tools/monte-audit/gcs-iam-dryrun-commands.ps1.out`.

It does NOT execute any gcloud commands by default — it only writes suggested commands.
Replace <SERVICE_ACCOUNT> placeholders before running the printed commands.
#>

$outDir = "tools/monte-audit/gcs-iam-dryrun"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
$bucketsFile = "tools/monte-audit/audit-latest/copilot-audit-buckets.json"
if (!(Test-Path $bucketsFile)) { Write-Error "Buckets file not found: $bucketsFile"; exit 1 }

$iamFile = "tools/monte-audit/audit-latest/copilot-audit-iam.json"
$iamSAs = @()
if (Test-Path $iamFile) {
  try {
    $iam = Get-Content $iamFile -Raw | ConvertFrom-Json
    foreach ($b in $iam.bindings) {
      foreach ($m in $b.members) {
        if ($m -like 'serviceAccount:*') { $sa = $m -replace '^serviceAccount:'; $iamSAs += $sa }
      }
    }
    $iamSAs = $iamSAs | Select-Object -Unique
  } catch {
    Write-Warning "Failed to parse IAM file: $_"
  }
} else {
  Write-Output "IAM file not found; will use placeholders where no SA detected."
}

# build keyword -> SA map
$map = @{}
foreach ($sa in $iamSAs) {
  if ($sa -match 'cloudbuild') { $map.CloudBuild += ,$sa }
  if ($sa -match 'appspot') { $map.AppSpot += ,$sa }
  if ($sa -match 'compute@developer') { $map.Compute += ,$sa }
  if ($sa -match 'gcf-admin' -or $sa -match 'gcf-admin-robot' -or $sa -match 'gcf-admin') { $map.GCF += ,$sa }
  if ($sa -match 'cloudfunctions' -or $sa -match 'gcf') { $map.CloudFunctions += ,$sa }
  if ($sa -match 'firebase') { $map.Firebase += ,$sa }
  if ($sa -match 'serviceAccount:') { }
}

$buckets = Get-Content $bucketsFile -Raw | ConvertFrom-Json
$commands = @()

foreach ($b in $buckets) {
  $name = $b.name
  $safe = $name -replace '[\\/:*?"<>|]','_' 
  $backupFile = "$outDir/$safe-policy-backup.json"

  # heuristics to pick probable SAs
  $suggested = @()
  if ($name -match 'cloudbuild') { $suggested += $map.CloudBuild }
  if ($name -match 'gcf' -or $name -match 'functions') { $suggested += $map.GCF; $suggested += $map.CloudFunctions }
  if ($name -match 'uploads' -or $name -match 'appspot') { $suggested += $map.AppSpot; $suggested += $map.Compute }
  if ($name -match 'cloudbuild' -and -not $suggested) { $suggested += $map.CloudBuild }
  if (-not $suggested) { $suggested += $map.CloudBuild; $suggested += $map.Compute; $suggested += $map.AppSpot }

  # flatten and unique
  $suggested = $suggested | Where-Object { $_ } | Select-Object -Unique

  $commands += "# Bucket: $name"
  $commands += "# Backup current policy"
  $commands += "gcloud storage buckets get-iam-policy \"gs://$name\" --format=json > \"$backupFile\""

  if ($suggested.Count -gt 0) {
    $commands += "# Suggested service accounts for this bucket: $($suggested -join ', ')"
    $mainSA = $suggested[0]
    $viewerSA = if ($suggested.Count -gt 1) { $suggested[1] } else { $mainSA }
    $commands += "gcloud storage buckets add-iam-policy-binding \"gs://$name\" --member=serviceAccount:$mainSA --role=roles/storage.objectAdmin"
    $commands += "gcloud storage buckets add-iam-policy-binding \"gs://$name\" --member=serviceAccount:$viewerSA --role=roles/storage.objectViewer"
  } else {
    $commands += "# No suggested SA found; replace <SERVICE_ACCOUNT> below"
    $commands += "gcloud storage buckets add-iam-policy-binding \"gs://$name\" --member=serviceAccount:<SERVICE_ACCOUNT> --role=roles/storage.objectAdmin"
    $commands += "gcloud storage buckets add-iam-policy-binding \"gs://$name\" --member=serviceAccount:<SERVICE_ACCOUNT> --role=roles/storage.objectViewer"
  }

  $commands += "# Remove legacy project-level binding example (change exact member/role using backup)"
  $commands += "gcloud storage buckets remove-iam-policy-binding \"gs://$name\" --member=projectEditor:rivoct-sandbox --role=roles/storage.legacyBucketOwner"
  $commands += ""
}

$out = "$outDir/gcs-iam-dryrun-commands-autofill.ps1.out"
$commands | Tee-Object -FilePath $out
Write-Output "Auto-filled dry-run commands written to $out — review before executing."
