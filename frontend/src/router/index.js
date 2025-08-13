import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const Home = () => import("@/pages/Home.vue");
const Help = () => import("@/pages/Help.vue");
const Advisory = () => import("@/pages/Advisory.vue");
const AdvisoryRequests = () => import("@/pages/AdvisoryRequests.vue");
const Directory = () => import("@/pages/Directory.vue");
const ClubDetail = () => import("@/pages/ClubDetail.vue");
const Events = () => import("@/pages/Events.vue");
const EventDetail = () => import("@/pages/EventDetail.vue");
const Resources = () => import("@/pages/Resources.vue");
const Stories = () => import("@/pages/Stories.vue");
const Promote = () => import("@/pages/Promote.vue");
const Login = () => import("@/pages/Login.vue");
const Me = () => import("@/pages/Me.vue");
const AdminDashboard = () => import("@/pages/admin/Dashboard.vue");
const ClubsCMS = () => import("@/pages/admin/ClubsCMS.vue");
const EventsCMS = () => import("@/pages/admin/EventsCMS.vue");
const ResourcesCMS = () => import("@/pages/admin/ResourcesCMS.vue");
const PromoCMS = () => import("@/pages/admin/PromoCMS.vue");
const RequestsBoard = () => import("@/pages/admin/RequestsBoard.vue");

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/help", name: "help", component: Help },
  { path: "/advisory", name: "advisory", component: Advisory },
  {
    path: "/advisory/requests",
    name: "advisory-requests",
    component: AdvisoryRequests,
    meta: { requiresAuth: true },
  },
  { path: "/directory", name: "directory", component: Directory },
  { path: "/directory/:clubId", name: "club-detail", component: ClubDetail },
  { path: "/events", name: "events", component: Events },
  { path: "/events/:eventId", name: "event-detail", component: EventDetail },
  { path: "/resources", name: "resources", component: Resources },
  { path: "/stories", name: "stories", component: Stories },
  { path: "/promote", name: "promote", component: Promote },
  { path: "/login", name: "login", component: Login },
  { path: "/me", name: "me", component: Me, meta: { requiresAuth: true } },
  {
    path: "/admin",
    name: "admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ["committee", "admin"] },
    children: [
      {
        path: "clubs",
        name: "admin-clubs",
        component: ClubsCMS,
        meta: { roles: ["committee", "admin"] },
      },
      {
        path: "events",
        name: "admin-events",
        component: EventsCMS,
        meta: { roles: ["committee", "admin"] },
      },
      {
        path: "resources",
        name: "admin-resources",
        component: ResourcesCMS,
        meta: { roles: ["committee", "admin"] },
      },
      {
        path: "promo",
        name: "admin-promo",
        component: PromoCMS,
        meta: { roles: ["committee", "admin"] },
      },
      {
        path: "requests",
        name: "admin-requests",
        component: RequestsBoard,
        meta: { roles: ["committee", "admin"] },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta?.requiresAuth && !auth.isLoggedIn) {
    return { name: "login", query: { redirect: to.fullPath } };
  }
  if (to.meta?.roles && !auth.hasAnyRole(to.meta.roles)) {
    return { name: "home" };
  }
});

export default router;
