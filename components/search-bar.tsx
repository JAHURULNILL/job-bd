type SearchBarProps = {
  action?: string;
  query?: string;
  placeholder?: string;
  name?: string;
};

export function SearchBar({
  action = "/jobs",
  query = "",
  placeholder = "পদ, কোম্পানি বা লোকেশন দিয়ে খুঁজুন",
  name = "q",
}: SearchBarProps) {
  return (
    <form
      action={action}
      className="flex w-full flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:flex-row"
    >
      <input
        type="search"
        name={name}
        defaultValue={query}
        placeholder={placeholder}
        className="h-12 flex-1 rounded-2xl border border-transparent bg-slate-50 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-200 focus:bg-white"
      />
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        খুঁজুন
      </button>
    </form>
  );
}
