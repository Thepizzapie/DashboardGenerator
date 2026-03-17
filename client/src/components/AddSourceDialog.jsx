import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const API = "http://localhost:3001";

// ── Icons ────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const RemoveIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

// ── Source types ──────────────────────────────────────────────────────────────

const SOURCE_TYPES = [
  { value: "url",      emoji: "🌐", label: "URL",      sub: "Fetch any JSON API" },
  { value: "sheets",   emoji: "📊", label: "Sheets",   sub: "Google Spreadsheet" },
  { value: "notion",   emoji: "🗒️", label: "Notion",   sub: "Notion database" },
  { value: "airtable", emoji: "⊞",  label: "Airtable", sub: "Airtable base" },
  { value: "db",       emoji: "🗄️", label: "Database", sub: "Postgres / MySQL" },
  { value: "webhook",  emoji: "🔗", label: "Webhook",  sub: "Push via HTTP POST" },
  { value: "csv",      emoji: "📄", label: "CSV",      sub: "Upload a .csv file" },
  { value: "json",     emoji: "📋", label: "JSON",     sub: "Paste raw JSON" },
];

const FETCHABLE = ["url", "sheets", "notion", "airtable", "db"];

function TypeCard({ opt, selected, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 1.25,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: selected ? "primary.main" : "divider",
        bgcolor: selected ? "rgba(99,102,241,0.08)" : "background.default",
        cursor: "pointer",
        textAlign: "center",
        transition: "border-color 0.12s",
        "&:hover": { borderColor: selected ? "primary.main" : "text.disabled" },
      }}
    >
      <Typography sx={{ fontSize: 18, lineHeight: 1, mb: 0.4 }}>{opt.emoji}</Typography>
      <Typography sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>{opt.label}</Typography>
      <Typography sx={{ fontSize: 9, color: "text.secondary", lineHeight: 1.3 }}>{opt.sub}</Typography>
    </Box>
  );
}

// ── Preview table ─────────────────────────────────────────────────────────────

function PreviewTable({ rows }) {
  if (!rows?.length) return <Typography variant="caption" color="text.secondary">No rows returned.</Typography>;
  const cols = Object.keys(rows[0]).slice(0, 6);
  return (
    <Box sx={{ overflowX: "auto", borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c} style={{ padding: "6px 10px", textAlign: "left", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap", color: "#94a3b8" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 5).map((row, i) => (
            <tr key={i}>
              {cols.map(c => (
                <td key={c} style={{ padding: "5px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {String(row[c] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

// ── Form fields per type ──────────────────────────────────────────────────────

function UrlFields({ config, setConfig, headerRows, setHeaderRows }) {
  function addHeader() { setHeaderRows(r => [...r, { key: "", value: "" }]); }
  function removeHeader(i) { setHeaderRows(r => r.filter((_, idx) => idx !== i)); }
  function updateHeader(i, field, val) {
    setHeaderRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row));
  }
  return (
    <Stack spacing={1.5}>
      <TextField label="Endpoint URL" size="small" fullWidth value={config.url || ""} onChange={e => setConfig(c => ({ ...c, url: e.target.value }))} placeholder="https://api.example.com/data.json" />
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", mb: 0.75 }}>
          Headers (optional)
        </Typography>
        {headerRows.map((row, i) => (
          <Stack key={i} direction="row" spacing={1} sx={{ mb: 0.75 }} alignItems="center">
            <TextField placeholder="Key" value={row.key} onChange={e => updateHeader(i, "key", e.target.value)} size="small" sx={{ flex: 1 }} />
            <TextField placeholder="Value" value={row.value} onChange={e => updateHeader(i, "value", e.target.value)} size="small" sx={{ flex: 1 }} />
            <IconButton size="small" onClick={() => removeHeader(i)} sx={{ color: "text.disabled" }}><RemoveIcon /></IconButton>
          </Stack>
        ))}
        <Button size="small" onClick={addHeader} sx={{ fontSize: 11, color: "text.secondary", px: 0 }}>+ Add header</Button>
      </Box>
    </Stack>
  );
}

function SheetsFields({ config, setConfig }) {
  return (
    <Stack spacing={1.5}>
      <TextField label="Spreadsheet ID" size="small" fullWidth value={config.sheet_id || ""} onChange={e => setConfig(c => ({ ...c, sheet_id: e.target.value }))} placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms" helperText="From the URL: /spreadsheets/d/{ID}/edit" />
      <TextField label="Range" size="small" fullWidth value={config.range || ""} onChange={e => setConfig(c => ({ ...c, range: e.target.value }))} placeholder="Sheet1!A1:Z1000" />
      <TextField label="API Key" size="small" fullWidth value={config.api_key || ""} onChange={e => setConfig(c => ({ ...c, api_key: e.target.value }))} type="password" helperText="Google Cloud → APIs → Credentials. Sheet must be publicly readable." />
    </Stack>
  );
}

function NotionFields({ config, setConfig }) {
  return (
    <Stack spacing={1.5}>
      <TextField label="Integration Token" size="small" fullWidth value={config.token || ""} onChange={e => setConfig(c => ({ ...c, token: e.target.value }))} type="password" placeholder="secret_..." helperText="notion.so/my-integrations → create integration" />
      <TextField label="Database ID" size="small" fullWidth value={config.database_id || ""} onChange={e => setConfig(c => ({ ...c, database_id: e.target.value }))} placeholder="32-char ID from database URL" helperText="Share the database with your integration first." />
    </Stack>
  );
}

function AirtableFields({ config, setConfig }) {
  return (
    <Stack spacing={1.5}>
      <TextField label="Personal Access Token" size="small" fullWidth value={config.api_key || ""} onChange={e => setConfig(c => ({ ...c, api_key: e.target.value }))} type="password" placeholder="pat..." helperText="airtable.com/create/tokens" />
      <TextField label="Base ID" size="small" fullWidth value={config.base_id || ""} onChange={e => setConfig(c => ({ ...c, base_id: e.target.value }))} placeholder="appXXXXXXXX" helperText="From the API docs URL for your base." />
      <TextField label="Table Name" size="small" fullWidth value={config.table_name || ""} onChange={e => setConfig(c => ({ ...c, table_name: e.target.value }))} placeholder="My Table" />
    </Stack>
  );
}

function DbFields({ config, setConfig }) {
  return (
    <Stack spacing={1.5}>
      <FormControl size="small" fullWidth>
        <InputLabel>Database type</InputLabel>
        <Select value={config.db_type || "postgres"} label="Database type" onChange={e => setConfig(c => ({ ...c, db_type: e.target.value }))}>
          <MenuItem value="postgres">PostgreSQL</MenuItem>
          <MenuItem value="mysql">MySQL</MenuItem>
        </Select>
      </FormControl>
      <TextField label="Connection string" size="small" fullWidth value={config.connection_string || ""} onChange={e => setConfig(c => ({ ...c, connection_string: e.target.value }))} type="password" placeholder="postgres://user:pass@host:5432/db" />
      <TextField label="Query (read-only)" size="small" fullWidth multiline rows={3} value={config.query || ""} onChange={e => setConfig(c => ({ ...c, query: e.target.value }))} placeholder="SELECT * FROM orders LIMIT 500" sx={{ "& .MuiOutlinedInput-root": { fontFamily: "monospace", fontSize: 12 } }} helperText="Returns rows as JSON. Use LIMIT to keep responses fast." />
    </Stack>
  );
}

function WebhookInfo() {
  return (
    <Box sx={{ p: 2, bgcolor: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 1.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>How it works</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.7, display: "block" }}>
        After saving, you'll get a unique webhook URL. Any service (Zapier, your backend, GitHub Actions) can <code>POST</code> a JSON array or object to it — Dashy stores it as the source data automatically.
      </Typography>
    </Box>
  );
}

function CsvUpload({ csvFile, setCsvFile }) {
  return (
    <Box component="label" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, p: 3, border: "1.5px dashed", borderColor: csvFile ? "primary.main" : "divider", borderRadius: 1.5, bgcolor: csvFile ? "rgba(99,102,241,0.06)" : "background.default", cursor: "pointer", "&:hover": { borderColor: "text.disabled" } }}>
      <Typography sx={{ fontSize: 26 }}>{csvFile ? "✅" : "📂"}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12 }}>{csvFile ? csvFile.name : "Click to choose a CSV file"}</Typography>
      <Typography variant="caption" color="text.secondary">{csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB` : "Up to 5 MB"}</Typography>
      <input type="file" accept=".csv" hidden onChange={e => setCsvFile(e.target.files?.[0] ?? null)} />
    </Box>
  );
}

function JsonPaste({ jsonText, setJsonText }) {
  return (
    <TextField label="JSON data" value={jsonText} onChange={e => setJsonText(e.target.value)} multiline rows={6} size="small" fullWidth placeholder={'[\n  { "col": "value" },\n  ...\n]'} sx={{ "& .MuiOutlinedInput-root": { fontFamily: '"JetBrains Mono","Fira Code","Consolas",monospace', fontSize: 12 } }} />
  );
}

// ── Main dialog ───────────────────────────────────────────────────────────────

export default function AddSourceDialog({ open, onClose, onSubmit, onSubmitCsv }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("url");
  const [config, setConfig] = useState({});
  const [headerRows, setHeaderRows] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [jsonText, setJsonText] = useState("");
  const [preview, setPreview] = useState(null);   // { data, rows }
  const [previewing, setPreviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function reset() {
    setName(""); setType("url"); setConfig({}); setHeaderRows([]);
    setCsvFile(null); setJsonText(""); setPreview(null);
    setPreviewing(false); setSubmitting(false); setError(""); setCopied(false);
  }

  function handleClose() { reset(); onClose(); }

  function buildPayload() {
    if (type === "url") {
      const headers = Object.fromEntries(headerRows.filter(r => r.key).map(r => [r.key, r.value]));
      return { name: name.trim(), type: "url", url: config.url, config: headers };
    }
    if (type === "sheets")   return { name: name.trim(), type: "sheets",   config: { sheet_id: config.sheet_id, range: config.range, api_key: config.api_key } };
    if (type === "notion")   return { name: name.trim(), type: "notion",   config: { token: config.token, database_id: config.database_id } };
    if (type === "airtable") return { name: name.trim(), type: "airtable", config: { api_key: config.api_key, base_id: config.base_id, table_name: config.table_name } };
    if (type === "db")       return { name: name.trim(), type: "db",       db_type: config.db_type || "postgres", db_query: config.query, config: { connection_string: config.connection_string } };
    if (type === "webhook")  return { name: name.trim(), type: "webhook" };
    return null;
  }

  async function handlePreview() {
    if (!name.trim()) { setError("Name is required"); return; }
    setError("");
    setPreviewing(true);
    try {
      const payload = buildPayload();
      const res = await fetch(`${API}/api/sources/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setPreview(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setPreviewing(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required"); return; }
    setError("");
    setSubmitting(true);
    try {
      if (type === "csv") {
        if (!csvFile) { setError("Please select a CSV file"); setSubmitting(false); return; }
        await onSubmitCsv(csvFile, name.trim());
      } else if (type === "json") {
        let data;
        try { data = JSON.parse(jsonText); } catch (_) { setError("Invalid JSON"); setSubmitting(false); return; }
        await onSubmit({ name: name.trim(), type: "json", data });
      } else {
        await onSubmit(buildPayload());
      }
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to add source");
    } finally {
      setSubmitting(false);
    }
  }

  const showPreviewBtn = FETCHABLE.includes(type);
  const isMono = SOURCE_TYPES.find(t => t.value === type);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, bgcolor: "background.paper" } }}>
      {/* Header */}
      <DialogTitle sx={{ pb: 0, pt: 2.5, px: 2.5, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            Add Data Source
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Available in every generation prompt once added
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: "text.disabled", mt: 0.25 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 2.5, pt: 2, pb: 1, display: "flex", flexDirection: "column", gap: 2 }}>

          {error && <Alert severity="error" sx={{ py: 0.5, fontSize: 12 }}>{error}</Alert>}

          {/* Name */}
          <TextField
            label="Source name"
            value={name}
            onChange={e => setName(e.target.value)}
            required size="small" fullWidth
            placeholder="e.g. sales_data"
            helperText="Used as the data key in prompts"
            FormHelperTextProps={{ sx: { mx: 0, mt: 0.5, fontSize: 10 } }}
          />

          {/* Type grid */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Source type
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
              {SOURCE_TYPES.map(opt => (
                <TypeCard key={opt.value} opt={opt} selected={type === opt.value} onClick={() => { setType(opt.value); setConfig({}); setPreview(null); setError(""); }} />
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Type-specific fields */}
          {type === "url"      && <UrlFields config={config} setConfig={setConfig} headerRows={headerRows} setHeaderRows={setHeaderRows} />}
          {type === "sheets"   && <SheetsFields config={config} setConfig={setConfig} />}
          {type === "notion"   && <NotionFields config={config} setConfig={setConfig} />}
          {type === "airtable" && <AirtableFields config={config} setConfig={setConfig} />}
          {type === "db"       && <DbFields config={config} setConfig={setConfig} />}
          {type === "webhook"  && <WebhookInfo />}
          {type === "csv"      && <CsvUpload csvFile={csvFile} setCsvFile={setCsvFile} />}
          {type === "json"     && <JsonPaste jsonText={jsonText} setJsonText={setJsonText} />}

          {/* Preview result */}
          {preview && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary" }}>
                  Preview
                </Typography>
                <Chip label={`${preview.data?.length ?? 0} rows`} size="small" color="success" sx={{ height: 16, fontSize: 10, fontWeight: 700 }} />
              </Stack>
              <PreviewTable rows={preview.preview} />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1, gap: 1 }}>
          <Button onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>Cancel</Button>
          {showPreviewBtn && (
            <Button size="small" variant="outlined" disabled={previewing} onClick={handlePreview} sx={{ fontSize: 12 }}>
              {previewing ? "Fetching…" : "Fetch & Preview"}
            </Button>
          )}
          <Button type="submit" variant="contained" size="small" disabled={submitting} sx={{ fontWeight: 600, minWidth: 100 }}>
            {submitting ? "Adding…" : "Add Source"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
