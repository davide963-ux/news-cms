/**
 * Visual-only signup form — there is no email service wired up behind this
 * yet, so submitting does nothing. Swap the <form> action for a real
 * provider (Resend, Mailchimp, Supabase table + edge function, etc.) when
 * you're ready to actually collect addresses.
 */
export default function NewsletterBox() {
  return (
    <div className="rounded-xl border border-mint/30 bg-gradient-to-b from-panel to-soft p-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-mint-bright">
        Newsletter
      </h2>
      <p className="mt-2 text-sm text-mist">
        The day&apos;s biggest crypto stories, once a day.
      </p>
      <form
        className="mt-3 flex flex-col gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-line bg-base px-3 py-2 text-sm text-ink placeholder:text-mist/60 focus:border-mint focus:outline-none"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-mint px-3 py-2 text-sm font-bold text-base transition hover:bg-mint-bright"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
