import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface AppSettings {
  dashboardName: string;
  companyName: string;
  currency: string;
  dateFormat: string;

  theme: "light" | "dark" | "system";
  layout: "comfortable" | "compact";

  previewRows: number;
  autoRefresh: boolean;

  reportTitle: string;
  preparedBy: string;
  showCharts: boolean;
  showAIInsights: boolean;

  uploadNotifications: boolean;
  reportNotifications: boolean;
  aiNotifications: boolean;
}

export const defaultSettings: AppSettings = {
  dashboardName: "AI Business Analytics Dashboard",
  companyName: "My Company",
  currency: "INR",
  dateFormat: "DD/MM/YYYY",

  theme: "light",
  layout: "comfortable",

  previewRows: 10,
  autoRefresh: false,

  reportTitle: "Business Analytics Report",
  preparedBy: "",
  showCharts: true,
  showAIInsights: true,

  uploadNotifications: true,
  reportNotifications: true,
  aiNotifications: true,
};

interface SettingsContextType {
  settings: AppSettings;

  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void;

  updateSettings: (newSettings: Partial<AppSettings>) => void;

  saveSettings: () => void;

  resetSettings: () => void;
}

const SettingsContext = createContext<
  SettingsContextType | undefined
>(undefined);

const STORAGE_KEY = "ai_dashboard_settings";

export const SettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [settings, setSettings] =
    useState<AppSettings>(defaultSettings);

  /* ----------------------------------
     Load settings from localStorage
  ----------------------------------- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        setSettings({
          ...defaultSettings,
          ...parsed,
        });
      }
    } catch (error) {
      console.error("Unable to load dashboard settings:", error);
    }
  }, []);

  /* ----------------------------------
     Apply theme
  ----------------------------------- */
  useEffect(() => {
    const root = document.documentElement;

    let activeTheme = settings.theme;

    if (settings.theme === "system") {
      activeTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
        ? "dark"
        : "light";
    }

    root.setAttribute("data-theme", activeTheme);

    root.classList.remove("theme-light", "theme-dark");

    root.classList.add(
      activeTheme === "dark"
        ? "theme-dark"
        : "theme-light"
    );

    document.body.setAttribute(
      "data-dashboard-layout",
      settings.layout
    );
  }, [settings.theme, settings.layout]);

  /* ----------------------------------
     Update one setting
  ----------------------------------- */
  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* ----------------------------------
     Update multiple settings
  ----------------------------------- */
  const updateSettings = (
    newSettings: Partial<AppSettings>
  ) => {
    setSettings((previous) => ({
      ...previous,
      ...newSettings,
    }));
  };

  /* ----------------------------------
     Save
  ----------------------------------- */
  const saveSettings = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    window.dispatchEvent(
      new CustomEvent("dashboard-settings-updated", {
        detail: settings,
      })
    );
  };

  /* ----------------------------------
     Reset
  ----------------------------------- */
  const resetSettings = () => {
    setSettings(defaultSettings);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultSettings)
    );

    window.dispatchEvent(
      new CustomEvent("dashboard-settings-updated", {
        detail: defaultSettings,
      })
    );
  };

  const value = useMemo(
    () => ({
      settings,
      updateSetting,
      updateSettings,
      saveSettings,
      resetSettings,
    }),
    [settings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
};