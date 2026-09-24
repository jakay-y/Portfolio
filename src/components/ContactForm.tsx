import { useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
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
    formData.append("access_key", accessKey);
    formData.append("subject", "New message from justicenweke.com");

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="animate-fade-up flex flex-col items-center gap-3 rounded-[1.5rem] border border-border px-xl py-4xl text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
          <Check className="h-5 w-5" strokeWidth={2} />
        </span>
        <p className="font-heading text-heading-md font-medium tracking-tight">Message sent.</p>
        <p className="text-sm text-muted-foreground">I'll get back to you soon.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" type="text" autoComplete="name" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full resize-none rounded-[1rem] border border-border bg-card px-4 py-3 text-sm outline-none transition-colors duration-200 focus:border-foreground"
        />
      </div>

      {/* honeypot */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={cn(
            "inline-flex items-center gap-2 rounded-pill bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-[opacity,transform] duration-200 ease-smooth hover:scale-[1.02] active:scale-[0.97]",
            status === "submitting" && "opacity-70",
          )}
        >
          {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />}
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>

        {status === "error" && (
          <p className="animate-fade-up text-sm text-red-600">
            {accessKey
              ? "Something went wrong — try again, or email me directly."
              : "Form isn't configured yet — email me directly for now."}
          </p>
        )}
      </div>
    </form>
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
        className="w-full rounded-[1rem] border border-border bg-card px-4 py-3 text-sm outline-none transition-colors duration-200 focus:border-foreground"
      />
    </div>
  );
}
