import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function AddSourceDialog({ open, onClose, onSubmit, onSubmitCsv }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("url");
  const [url, setUrl] = useState("");
  const [headerRows, setHeaderRows] = useState([]);
  const [jsonText, setJsonText] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setName(""); setType("url"); setUrl(""); setHeaderRows([]);
    setJsonText(""); setCsvFile(null); setSubmitting(false); setError("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function addHeader() {
    setHeaderRows((r) => [...r, { key: "", value: "" }]);
  }

  function removeHeader(i) {
    setHeaderRows((r) => r.filter((_, idx) => idx !== i));
  }

  function updateHeader(i, field, val) {
    setHeaderRows((r) => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required"); return; }
    setError("");
    setSubmitting(true);
    try {
      if (type === "url") {
        const headers = Object.fromEntries(headerRows.filter(r => r.key).map(r => [r.key, r.value]));
        await onSubmit({ name: name.trim(), type: "url", url: url.trim(), headers });
      } else if (type === "csv") {
        if (!csvFile) { setError("Please select a CSV file"); setSubmitting(false); return; }
        await onSubmitCsv(csvFile, name.trim());
      } else if (type === "json") {
        let data;
        try { data = JSON.parse(jsonText); } catch (_) { setError("Invalid JSON"); setSubmitting(false); return; }
        await onSubmit({ name: name.trim(), type: "json", data });
      }
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to add source");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Add Data Source</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 0 }}>{error}</Alert>}

          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            size="small"
            fullWidth
            placeholder="my_sales_data"
          />

          <FormControl size="small" fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={type} label="Type" onChange={(e) => setType(e.target.value)}>
              <MenuItem value="url">URL (fetch JSON)</MenuItem>
              <MenuItem value="csv">CSV Upload</MenuItem>
              <MenuItem value="json">JSON Paste</MenuItem>
            </Select>
          </FormControl>

          {type === "url" && (
            <>
              <TextField
                label="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                size="small"
                fullWidth
                placeholder="https://api.example.com/data.json"
              />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                  Headers (optional)
                </Typography>
                {headerRows.map((row, i) => (
                  <Stack key={i} direction="row" spacing={1} sx={{ mb: 1 }} alignItems="center">
                    <TextField
                      placeholder="Key"
                      value={row.key}
                      onChange={(e) => updateHeader(i, "key", e.target.value)}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      placeholder="Value"
                      value={row.value}
                      onChange={(e) => updateHeader(i, "value", e.target.value)}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <IconButton size="small" onClick={() => removeHeader(i)}>
                      <CloseIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Button size="small" onClick={addHeader} variant="outlined" sx={{ fontSize: 11 }}>
                  + Add header
                </Button>
              </Box>
            </>
          )}

          {type === "csv" && (
            <Box>
              <Button variant="outlined" component="label" size="small">
                Choose CSV file
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1.5 }}>
                {csvFile ? csvFile.name : "No file chosen"}
              </Typography>
            </Box>
          )}

          {type === "json" && (
            <TextField
              label="JSON data"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              multiline
              rows={6}
              size="small"
              fullWidth
              placeholder='[{"col": "value"}, ...]'
              sx={{ "& .MuiOutlinedInput-root": { fontFamily: '"SF Mono","Fira Code","Consolas",monospace', fontSize: 12 } }}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} size="small">Cancel</Button>
          <Button type="submit" variant="contained" size="small" disabled={submitting}>
            {submitting ? "Adding…" : "Add Source"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
