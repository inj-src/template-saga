// import parse from "multi-number-parse";
import Handlebars from "handlebars";
import { parse, type HTMLElement as NodeHTMLElement } from "node-html-parser";
import * as parseNumber from "multi-number-parse";
import * as H from "just-handlebars-helpers";


export function registerAccumulateHelper() {
  const parse = parseNumber.default;
  Handlebars.registerHelper(
    "accumulate",
    function (
      this: Record<string, number>,
      value: number | string,
      options: Handlebars.HelperOptions
    ) {
      const initial = options.hash.initial || 0;
      let key = options.hash.key || value;

      if (typeof value === "string" && isNaN(parse(value))) {
        value = this[key] || 0;
      } else {
        key ??= "_accumulate_";
      }

      if (!options.data._parent[key]) {
        options.data._parent[key] = parse(initial);
      }

      // Add the current value
      return (options.data._parent[key] += parse(value));
    }
  );
}
interface TableContext {
  [key: string]: unknown;
}

export function registerTableHelper() {
  Handlebars.registerHelper("table", tableHelper);
  Handlebars.registerHelper("table-target", tableTarget);
}

function tableTarget(this: unknown, targetName: string, options: Handlebars.HelperOptions) {
  const data = Handlebars.createFrame(options.data);

  const codeBlock = options.fn(undefined, { data });
  const root = parse(codeBlock);
  const table = root.querySelector("table");
  if (table) {
    table.setAttribute("data-_table-target_", targetName || "target");
  } else {
    console.warn("table target helper: no <table> element found in block content");
    return codeBlock;
  }
  return new Handlebars.SafeString(root.toString());
}

function tableHelper(context: TableContext[], options: Handlebars.HelperOptions) {
  if (!Array.isArray(context)) {
    console.warn("table helper expects an array as the first argument");
    return "Handlebars table helper error: first argument is not an array";
  }

  let data: Record<string, unknown> | undefined;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if (data) {
    data.length = context.length;
    helperFunctions(data, context, options);
  }

  const runtimeOptions: Handlebars.RuntimeOptions = { data };

  const blockContent = options.fn(undefined, runtimeOptions);

  const root = parse(blockContent);
  const tableSelector = `table[data-_table-target_="${options.hash.target || 'target'}"]`

  // If no table is found with the table selector then catch the first table;
  const table = root.querySelector(tableSelector) || root.querySelector("table");
  if (!table) {
    console.warn("table helper: no <table> element found in block content");
    return blockContent;
  }

  const allRows = table.querySelectorAll("tr");

  const templateRows: NodeHTMLElement[] = [];

  for (let i = allRows.length - 1; i >= 0; i--) {
    const row = allRows[i];
    const cells = row.querySelectorAll("td");

    for (const td of cells) {
      const tdContent = td.text.trim();
      // the regex checks for patterns like {{ variable }} or \{{ variable }}
      if (/^\\?\{\{.+\}\}$/.test(tdContent)) {
        templateRows.push(row);
        break;
      }
    }
  }

  if (templateRows.length === 0) {
    console.warn("table helper: no template row found (no row with <td> elements)");
    return blockContent;
  }

  if (context.length === 0) {
    templateRows.forEach((row) => row.remove());
    return new Handlebars.SafeString(root.toString());
  }

  const templateRowString = templateRows.reduceRight((acc, row) => {
    return row.toString() + acc;
  }, "");

  const templateString = `{{#each this}}${templateRowString}{{/each}}`;
  const template = Handlebars.compile(templateString);
  const rows = template(context, runtimeOptions);
  templateRows[0].after(rows);
  templateRows.forEach((row) => row.remove());
  return new Handlebars.SafeString(root.toString());
}

function helperFunctions(
  data: Record<string, unknown>,
  context: TableContext[],
  options: Handlebars.HelperOptions
) {
  const parse = parseNumber.default;

  if ("sum" in options.hash) {
    sumOrMultiply("sum");
  }
  if ("multiply" in options.hash) {
    sumOrMultiply("multiply");
  }

  function sumOrMultiply(operator: "sum" | "multiply") {
    const keys = options.hash[operator];
    if (typeof keys !== "string") {
      console.warn(`table helper: ${operator} option should be a comma-separated string`);
    } else {
      const getKeys = (item: object) => {
        // if (keys === "true") return Object.keys(item);
        const returnArray = [];
        for (const key of keys.split(",")) {
          const trimmedKey = key.trim();
          if (trimmedKey in item) returnArray.push(trimmedKey);
        }
        return returnArray;
      };

      // sum all numeric fields
      context.forEach((item) => {
        getKeys(item).forEach((key) => {
          const value1 = (data[`${operator}-${key}`] as number) ?? 0;
          const value2 = parse((item[key] as number) ?? 0);
          if (operator === "multiply") {
            data[`multiply-${key}`] = value1 * value2;
          } else {
            data[`sum-${key}`] = value1 + value2;
          }
        });
      });
    }
  }

  if ("length" in options.hash) {
    const keys = options.hash.length;
    if (typeof keys !== "string") {
      console.warn("table helper: length option should be a comma-separated string");
      return;
    } else {
      const getKeys = (item: object) => {
        // if (keys === "true") return Object.keys(item);
        const returnArray = [];
        for (const key of keys.split(",")) {
          const trimmedKey = key.trim();
          if (trimmedKey in item) returnArray.push(trimmedKey);
        }
        return returnArray;
      };

      context.forEach((item) => {
        getKeys(item).forEach((key) => {
          data[`length-${key}`] = ((data[`length-${key}`] as number) ?? 0) + 1;
        });
      });
    }
  }

  if ("max" in options.hash) {
    const max = options.hash.max;
    if (typeof max !== "string") {
      console.warn("table helper: max option should be a comma-separated string");
      return;
    }
    const keysToMax = max.split(",").map((key) => key.trim());
    keysToMax.forEach((key) => {
      context
        .sort((a, b) => {
          return parse((b[key] as number) ?? -Infinity) - parse((a[key] as number) ?? -Infinity);
        })
        .forEach((item, index) => {
          data[`max-${key}-${index + 1}`] = item[key];
        });
    });
  }

  if ("min" in options.hash) {
    const min = options.hash.min;
    if (typeof min !== "string") {
      console.warn("table helper: min option should be a comma-separated string");
      return;
    }
    const keysToMin = min.split(",").map((key) => key.trim());
    keysToMin.forEach((key) => {
      context
        .sort((a, b) => {
          return parse((a[key] as number) ?? Infinity) - parse((b[key] as number) ?? Infinity);
        })
        .forEach((item, index) => {
          data[`min-${key}-${index + 1}`] = item[key];
        });
    });
  }
}

export function registerHandleMissingHelper() {
  Handlebars.registerHelper("helperMissing", function (this: unknown, ...args: unknown[]) {
    const options = args[args.length - 1] as Handlebars.HelperOptions & { name: string };
    const params = args.slice(0, -1);

    // Regular missing helper (not a block)
    const paramsStr = params.length > 0 ? params.join(", ") : "";
    return new Handlebars.SafeString(
      `<span style="color: red; font-weight: bold;">[Missing helper: ${options.name}(${paramsStr})]</span>`
    );
  });

  // blockHelperMissing is only called when the name matches a property in the context
  // but it's being used as a block helper
  Handlebars.registerHelper("blockHelperMissing", function (this: unknown, ...args: unknown[]) {
    // blockHelperMissing can be called with just options, or with context and options
    const options = args[args.length - 1] as Handlebars.HelperOptions & { name: string };
    const context = args.length > 1 ? args[0] : this;

    console.warn("Block helper missing (property exists but used as block):", options.name);

    const blockContent = typeof options.fn === "function" ? options.fn(context) : "";
    return new Handlebars.SafeString(
      `<div style="border: 2px solid orange; padding: 10px; margin: 5px 0;">` +
        `<strong style="color: orange;">[Property '${options.name}' used as block helper]</strong>` +
        `<div>${blockContent}</div>` +
        `</div>`
    );
  });
}

/**
 * Register just-handlebars-helpers
 * @see https://github.com/leapfrogtechnology/just-handlebars-helpers
 */
export function registerJustHandlebarsHelpers() {
  H.registerHelpers(Handlebars);
}

export function registerAllHelpers() {
  registerAccumulateHelper();
  registerTableHelper();
  registerHandleMissingHelper();
  registerJustHandlebarsHelpers();
}

