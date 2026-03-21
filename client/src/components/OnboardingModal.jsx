import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";

const STEPS = [
  {
    emoji: "👋",
    title: "Welcome to Dashy!",
    desc: "Dashy turns plain-English descriptions into beautiful dashboards, charts, and infographics in seconds — no coding required.",
  },
  {
    emoji: "✍️",
    title: "Just describe what you need",
    desc: 'Type something like "Show me a revenue dashboard with monthly trends and KPI cards" and watch Dashy build it for you.',
  },
  {
    emoji: "🚀",
    title: "Save, share, and iterate",
    desc: "Save your dashboards to your gallery, share them with a public link, or keep editing until they're perfect.",
  },
];

export default function OnboardingModal({ open, onClose, onStart }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function handleNext() {
    if (isLast) {
      onStart();
    } else {
      setStep(s => s + 1);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Top colored area */}
        <Box sx={{
          bgcolor: "rgba(37,99,235,0.08)",
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex", alignItems: "center", justifyContent: "center",
          py: 5, px: 3,
        }}>
          <Typography sx={{ fontSize: 64 }}>{current.emoji}</Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>{current.title}</Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.7, fontSize: 14 }}>{current.desc}</Typography>
        </Box>

        {/* Stepper + actions */}
        <Box sx={{ px: 3, pb: 3 }}>
          <MobileStepper
            variant="dots"
            steps={STEPS.length}
            position="static"
            activeStep={step}
            sx={{ bgcolor: "transparent", p: 0, mb: 2 }}
            nextButton={<span />}
            backButton={<span />}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            {step > 0 && (
              <Button onClick={() => setStep(s => s - 1)} sx={{ flex: 1, textTransform: "none", color: "text.secondary" }}>
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              variant="contained"
              fullWidth={step === 0}
              sx={{ flex: step > 0 ? 2 : 1 }}
            >
              {isLast ? "Get started →" : "Next"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
