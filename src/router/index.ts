import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import { PublicController, UserController } from "@/controllers";

Vue.use(VueRouter);

let first_route = true;

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  if (first_route) {
    first_route = false;

    await UserController.get_logged();
    PublicController.page_ready = true;
  }
  const is_auth = UserController.state == "active";

  if (to.path === "/") {
    next(is_auth ? "/dashboard/analysis" : "/login");
  } else if (to.matched.some(record => record.meta.user) && !is_auth) {
    next("/login");
  } else if (to.matched.some(record => record.meta.guest) && is_auth) {
    next("/dashboard/analysis");
  } else {
    next();
  }
});

export default router;
