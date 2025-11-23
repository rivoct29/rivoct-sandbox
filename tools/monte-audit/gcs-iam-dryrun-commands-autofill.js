const fs = require('fs');
const path = require('path');

const root = process.cwd();
const bucketsFile = path.join(root, 'tools', 'monte-audit', 'audit-latest', 'copilot-audit-buckets.json');
const iamFile = path.join(root, 'tools', 'monte-audit', 'audit-latest', 'copilot-audit-iam.json');
const outDir = path.join(root, 'tools', 'monte-audit', 'gcs-iam-dryrun');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

if (!fs.existsSync(bucketsFile)) {
  console.error('Buckets file not found:', bucketsFile);
  process.exit(1);
}

let iamSAs = [];
if (fs.existsSync(iamFile)) {
  try {
    const iam = JSON.parse(fs.readFileSync(iamFile, 'utf8'));
    (iam.bindings || []).forEach(b => {
      (b.members || []).forEach(m => {
        if (m.startsWith('serviceAccount:')) iamSAs.push(m.replace(/^serviceAccount:/, ''));
      });
    });
    iamSAs = Array.from(new Set(iamSAs));
  } catch (e) {
    console.error('Failed to parse IAM file:', e.message);
  }
} else {
  console.log('IAM file not found; will use placeholders where no SA detected.');
}

const map = {};
iamSAs.forEach(sa => {
  if (sa.includes('cloudbuild')) { (map.CloudBuild || (map.CloudBuild = [])).push(sa); }
  if (sa.includes('appspot')) { (map.AppSpot || (map.AppSpot = [])).push(sa); }
  if (sa.includes('compute@developer')) { (map.Compute || (map.Compute = [])).push(sa); }
  if (sa.match(/gcf-admin|gcf-admin-robot/)) { (map.GCF || (map.GCF = [])).push(sa); }
  if (sa.includes('cloudfunctions') || sa.includes('gcf')) { (map.CloudFunctions || (map.CloudFunctions = [])).push(sa); }
  if (sa.includes('firebase')) { (map.Firebase || (map.Firebase = [])).push(sa); }
});

const buckets = JSON.parse(fs.readFileSync(bucketsFile, 'utf8'));
const lines = [];
for (const b of buckets) {
  const name = b.name;
  const safe = name.replace(/[\\/:*?"<>|]/g, '_');
  const backupFile = path.join(outDir, `${safe}-policy-backup.json`);

  let suggested = [];
  if (/cloudbuild/i.test(name)) suggested = suggested.concat(map.CloudBuild || []);
  if (/gcf|functions/i.test(name)) suggested = suggested.concat(map.GCF || []).concat(map.CloudFunctions || []);
  if (/uploads|appspot/i.test(name)) suggested = suggested.concat(map.AppSpot || []).concat(map.Compute || []);
  if (/cloudbuild/i.test(name) && suggested.length === 0) suggested = suggested.concat(map.CloudBuild || []);
  if (suggested.length === 0) suggested = suggested.concat(map.CloudBuild || []).concat(map.Compute || []).concat(map.AppSpot || []);
  suggested = Array.from(new Set(suggested)).filter(Boolean);

  lines.push(`# Bucket: ${name}`);
  lines.push(`# Backup current policy`);
  lines.push(`gcloud storage buckets get-iam-policy "gs://${name}" --format=json > "${backupFile}"`);

  if (suggested.length > 0) {
    lines.push(`# Suggested service accounts for this bucket: ${suggested.join(', ')}`);
    const mainSA = suggested[0];
    const viewerSA = suggested[1] || mainSA;
    lines.push(`gcloud storage buckets add-iam-policy-binding "gs://${name}" --member=serviceAccount:${mainSA} --role=roles/storage.objectAdmin`);
    lines.push(`gcloud storage buckets add-iam-policy-binding "gs://${name}" --member=serviceAccount:${viewerSA} --role=roles/storage.objectViewer`);
  } else {
    lines.push(`# No suggested SA found; replace <SERVICE_ACCOUNT> below`);
    lines.push(`gcloud storage buckets add-iam-policy-binding "gs://${name}" --member=serviceAccount:<SERVICE_ACCOUNT> --role=roles/storage.objectAdmin`);
    lines.push(`gcloud storage buckets add-iam-policy-binding "gs://${name}" --member=serviceAccount:<SERVICE_ACCOUNT> --role=roles/storage.objectViewer`);
  }

  lines.push(`# Remove legacy project-level binding example (change exact member/role using backup)`);
  lines.push(`gcloud storage buckets remove-iam-policy-binding "gs://${name}" --member=projectEditor:rivoct-sandbox --role=roles/storage.legacyBucketOwner`);
  lines.push('');
}

const out = path.join(outDir, 'gcs-iam-dryrun-commands-autofill.ps1.out');
fs.writeFileSync(out, lines.join('\n'));
console.log('Auto-filled dry-run commands written to', out);
