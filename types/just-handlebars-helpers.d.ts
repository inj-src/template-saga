declare module "just-handlebars-helpers" {
  import Handlebars from "handlebars";

  /**
   * Register all just-handlebars-helpers with Handlebars
   * @param handlebars - The Handlebars instance to register helpers with
   */
  export function registerHelpers(handlebars: typeof Handlebars): void;
}
