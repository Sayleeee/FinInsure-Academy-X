import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { cn } from "../lib/utils";

const AUTH_KEY = "fininsure_auth";
const PASSWORD = "Iq!FinInsure#Academy";

const ALLOWED_EMAIL = "gawain@iqdigi.com";

export function AuthGate({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useI18n();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "true");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    sessionStorage.setItem(AUTH_KEY, authed.toString());
  }, [authed]);

  if (authed) return <>{children}</>;

  const clearErrors = () => {
    setUsernameError("");
    setPasswordError("");
  };

  const handleSubmit = () => {
    let hasError = false;
    if (email !== ALLOWED_EMAIL) {
      setUsernameError(t("Falscher Benutzername", "Incorrect username"));
      hasError = true;
    }
    if (password !== PASSWORD) {
      setPasswordError(t("Falsches Passwort", "Incorrect password"));
      hasError = true;
    }
    if (hasError) {
      setTimeout(clearErrors, 2000);
      return;
    }
    setAuthed(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!authed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-sm"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 p-8 flex flex-col items-center relative">
                <div className="absolute top-4 right-4 flex items-center bg-slate-800 p-0.5 rounded-md">
                  <button
                    onClick={() => setLang("de")}
                    className={cn(
                      "px-2 py-1 text-[10px] font-bold rounded transition-colors",
                      lang === "de" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"
                    )}
                  >
                    DE
                  </button>
                  <button
                    onClick={() => setLang("en")}
                    className={cn(
                      "px-2 py-1 text-[10px] font-bold rounded transition-colors",
                      lang === "en" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"
                    )}
                  >
                    EN
                  </button>
                </div>
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-orange-500/20">
                  <Lock className="w-7 h-7 text-orange-500" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  FinInsure Academy
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  {t("Zugriff geschützt", "Access Restricted")}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t("Benutzername", "Username")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder={t("Benutzername eingeben...", "Enter username...")}
                    autoFocus
                    className={cn(
                      "w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-sm outline-none transition-all focus:ring-4",
                      usernameError
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                    )}
                  />
                  {usernameError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1.5 font-medium"
                    >
                      {usernameError}
                    </motion.p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t("Passwort", "Password")}
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearErrors(); }}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder={t("Passwort eingeben...", "Enter password...")}
                      className={cn(
                        "w-full px-3 py-2.5 pr-10 bg-slate-50 border rounded-lg text-sm outline-none transition-all focus:ring-4",
                        passwordError
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1.5 font-medium"
                    >
                      {passwordError}
                    </motion.p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!email || !password}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  {t("Anmelden", "Sign In")}
                </button>

                <p className="text-[10px] text-slate-400 text-center pt-1">
                  {t("Nur für autorisierte Mitarbeiter", "Authorized personnel only")}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
