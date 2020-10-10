declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare module "vuetify/lib" {
  import a from "vuetify/types/lib";
  export * from a;
}
