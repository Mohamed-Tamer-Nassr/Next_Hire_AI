export const appPages = [
  {
    path: "/app/dashboard",
    title: "App Dashboard",
    breadcrumb: [{ name: "Dashboard", path: "/app/dashboard" }],
  },
  {
    path: "/app/interviews",
    title: "Interviews",
    breadcrumb: [{ name: "Interviews", path: "/app/interviews" }],
  },
  {
    path: "/app/results",
    title: "Results",
    breadcrumb: [{ name: "Results", path: "/app/results" }],
  },
  {
    path: "/app/invoices",
    title: "Invoices",
    breadcrumb: [{ name: "Invoices", path: "/app/invoices" }],
  },
  {
    path: "/app/me/update/profile",
    title: "Update Profile",
    breadcrumb: [{ name: "Update Profile", path: "/app/me/update/profile" }],
  },
  {
    path: "/app/me/update/password",
    title: "Update Password",
    breadcrumb: [{ name: "Update Password", path: "/app/me/update/password" }],
  },
  {
    path: "/app/unsubscribe",
    title: "Unsubscribe App",
    breadcrumb: [{ name: "Unsubscribe", path: "/app/unsubscribe" }],
  },
];

export const nestedPages = [
  {
    path: "/app/interviews/new",
    title: "Create New Interview",
    breadcrumb: [
      { name: "Interviews", path: "/app/interviews" },
      { name: "New", path: "/app/interviews/new" },
    ],
  },
  {
    path: "/app/interviews/:id",
    title: "Interview Details",
    breadcrumb: [
      { name: "Interviews", path: "/app/interviews" },
      { name: "Details", path: "/app/interviews/:id" },
    ],
  },

  {
    path: "/app/results/:id",
    title: "Result Details",
    breadcrumb: [
      { name: "Results", path: "/app/results" },
      { name: "Details", path: "/app/results/:id" },
    ],
  },
];

export const adminPages = [
  {
    path: "/admin/dashboard",
    title: "Admin Dashboard",
    breadcrumb: [{ name: "Admin Dashboard", path: "/admin/dashboard" }],
  },
  {
    path: "/admin/interviews",
    title: "Interviews",
    breadcrumb: [{ name: "Interviews", path: "/admin/interviews" }],
  },
  {
    path: "/admin/users",
    title: "Users",
    breadcrumb: [{ name: "Users", path: "/admin/users" }],
  },
];

export const pageIcons: { [key: string]: { icon: string; color: string } } = {
  "/app/dashboard": {
    icon: "solar:chart-square-bold-duotone", // modern analytics/dashboard feel
    color: "success",
  },
  "/app/interviews": {
    icon: "solar:user-speak-bold", // focuses on speaking/interview vibe
    color: "primary",
  },
  "/app/results": {
    icon: "tabler:report-analytics", // results = achievement/score
    color: "secondary",
  },
  "/app/invoices": {
    icon: "solar:document-text-bold-duotone", // cleaner document/invoice representation
    color: "success",
  },
  "/app/me/update/profile": {
    icon: "solar:user-id-bold-duotone", // profile-centric, modern identity look
    color: "warning",
  },
  "/app/me/update/password": {
    icon: "solar:lock-keyhole-minimalistic-bold-duotone", // password/security focus
    color: "default",
  },
  "/app/unsubscribe": {
    icon: "solar:trash-bin-trash-bold-duotone", // clean and consistent “remove/exit” symbol
    color: "danger",
  },

  "/admin/dashboard": {
    icon: "solar:chart-square-bold-duotone",
    color: "success",
  },
  "/admin/interviews": {
    icon: "solar:microphone-2-bold-duotone",
    color: "primary",
  },
  "/admin/users": {
    icon: "solar:users-group-rounded-bold-duotone", // consistent rounded group icon
    color: "secondary",
  },
};
