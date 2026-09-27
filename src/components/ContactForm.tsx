import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { site } from "@/lib/site";
import { motionTokens } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const PROJECT_TYPES = ["Brand identity", "Website", "Web app / product", "Not sure yet"];
const BUDGETS = ["Under $2k", "$2k–$5k", "$5k–$15k", "$15k+"];
const EASE = motionTokens.easing.premium;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessKey) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (!formData.get("project_type")) formData.set("project_type", "Not specified");
    if (!formData.get("budget")) formData.set("budget", "Not specified");
    formData.append("access_key", accessKey);
    formData.append("subject", `New project enquiry — ${formData.get("project_type")}`);

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) {
        setName(String(formData.get("name") ?? "").trim().split(" ")[0]);
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <ThankYou key="thanks" name={name} onReset={() => setStatus("idle")} />
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="space-y-6 text-left"
          exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
          transition={{ duration: motionTokens.duration.small, ease: EASE }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" name="name" type="text" autoComplete="name" required />
            <Field label="Email" name="email" type="email" autoComplete="email" required />
          </div>

          <ChipGroup legend="Project type" name="project_type" options={PROJECT_TYPES} />
          <ChipGroup legend="Budget" name="budget" options={BUDGETS} />

          <div>
            <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder="What are you building, and when do you need it?"
              className="w-full resize-none rounded-[1rem] border border-border bg-card px-4 py-3 text-sm outline-none transition-colors duration-small placeholder:text-faint hover:border-foreground/40 focus:border-foreground"
            />
          </div>

          {/* honeypot */}
          <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="space-y-4 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">I reply within 24 hours.</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <button
                type="submit"
                disabled={status === "submitting"}
                className={cn(
                  "group inline-flex items-center gap-3 rounded-pill bg-primary py-2 pl-6 pr-2 text-sm font-medium text-primary-foreground transition-[opacity,transform] duration-small hover:scale-[1.02] active:scale-[0.97]",
                  status === "submitting" && "opacity-70",
                )}
              >
                {status === "submitting" ? "Sending…" : "Send message"}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-small group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  {status === "submitting" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                  ) : (
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                  )}
                </span>
              </button>

              {site.whatsapp && (
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative rounded-sm py-1 text-sm text-muted-foreground transition-colors duration-small hover:text-foreground"
                >
                  Prefer WhatsApp? →
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-small group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </a>
              )}
            </div>

            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  role="alert"
                  className="text-sm text-red-600"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: motionTokens.duration.small, ease: EASE }}
                >
                  {accessKey
                    ? "Something went wrong — try again, or email me directly."
                    : "Form isn't configured yet — email me directly for now."}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function ThankYou({ name, onReset }: { name: string; onReset: () => void }) {
  const item = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: motionTokens.duration.medium, ease: EASE, delay },
  });
  return (
    <motion.div
      role="status"
      className="flex flex-col items-center gap-3 px-2 py-4xl text-center"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: motionTokens.duration.medium, ease: EASE }}
    >
      <motion.span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: motionTokens.duration.medium, ease: EASE, delay: 0.25 }}
          />
        </svg>
      </motion.span>
      <motion.p className="mt-3 font-heading text-heading-lg font-medium tracking-tight" {...item(0.35)}>
        {name ? `Thanks, ${name}.` : "Thank you."}
      </motion.p>
      <motion.p className="max-w-xs text-sm text-muted-foreground" {...item(0.43)}>
        Your message is in. I’ll reply within 24 hours.
      </motion.p>
      <motion.button
        type="button"
        onClick={onReset}
        className="mt-3 rounded-sm text-sm text-muted-foreground underline underline-offset-4 transition-colors duration-small hover:text-foreground"
        {...item(0.51)}
      >
        Send another
      </motion.button>
    </motion.div>
  );
}

/** Single-choice chips — native radios underneath, so keyboard and screen readers work for free. */
function ChipGroup({ legend, name, options }: { legend: string; name: string; options: string[] }) {
  return (
    <fieldset>
      <legend className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip key={option} name={name} value={option}>
            {option}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

function Chip({ name, value, children }: { name: string; value: string; children: ReactNode }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={name} value={value} className="peer sr-only" />
      <span className="inline-flex rounded-pill border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-[color,background-color,border-color,transform] duration-small hover:border-foreground/50 hover:text-foreground active:scale-[0.97] peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground">
        {children}
      </span>
    </label>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-[1rem] border border-border bg-card px-4 py-3 text-sm outline-none transition-colors duration-small hover:border-foreground/40 focus:border-foreground"
      />
    </div>
  );
}
