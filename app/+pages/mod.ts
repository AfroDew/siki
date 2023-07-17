import home from "./home.ts";
import signin from "./signin.ts";
import verify from "./verify.ts";
import api from "./api/mod.ts";

export default {
  [home.path]: home,
  [signin.path]: signin,
  [verify.path]: verify,
  ...api,
};
