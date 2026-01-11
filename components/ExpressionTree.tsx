"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  parseHandlebarsExpressionsFlat,
  type ParsedExpression,
} from "@/lib/handlebars/expression-parser";
import { getHelperConfig } from "@/lib/handlebars/helpers-config";
import { useDataStore } from "@/app/store/useDataStore";

interface ExpressionRowProps {
  expr: ParsedExpression;
  lineNumber: number;
  onUpdate: (oldRaw: string, newRaw: string, position: number) => void;
}

const getDisplayParts = (expr: ParsedExpression) => {
    switch (expr.type) {
      case "block-open":
        return {
          prefix: `{{#${expr.helperName}`,
          argument: expr.argument ? ` ${expr.argument}` : "",
          suffix: "}}",
          buildRaw: (arg: string) => `{{#${expr.helperName}${arg ? ` ${arg}` : ""}}}`,
        };
      case "block-close":
        return {
          prefix: `{{/${expr.helperName}`,
          argument: "",
          suffix: "}}",
          buildRaw: () => expr.raw,
        };
      case "inline":
        return {
          prefix: `{{${expr.helperName}`,
          argument: expr.argument ? ` ${expr.argument}` : "",
          suffix: "}}",
          buildRaw: (arg: string) => `{{${expr.helperName}${arg ? ` ${arg}` : ""}}}`,
        };
      case "raw":
        return {
          prefix: "{{{",
          argument: expr.argument || "",
          suffix: "}}}",
          buildRaw: (arg: string) => `{{{${arg}}}}`,
        };
      case "escaped":
        return {
          prefix: "\\{{",
          argument: expr.argument || "",
          suffix: "}}",
          buildRaw: (arg: string) => `\\{{${arg}}}`,
        };
      default:
        return {
          prefix: "{{",
          argument: expr.argument || "",
          suffix: "}}",
          buildRaw: (arg: string) => `{{${arg}}}`,
        };
    }
  };


function ExpressionRow({ expr, lineNumber, onUpdate }: ExpressionRowProps) {
  const helperConfig = expr.helperName ? getHelperConfig(expr.helperName) : null;

  // Determine display value and styling based on expression type

  const parts = getDisplayParts(expr);
  const isBlockTag = expr.type === "block-open" || expr.type === "block-close";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newArg = e.target.value;
    const newRaw = parts.buildRaw(newArg);
    onUpdate(expr.raw, newRaw, expr.position);
  };

  return (
    <div className="flex items-center gap-0 font-mono text-[11px] hover:bg-muted/30 transition-colors group">
      {/* Line number - Fixed position on the left */}
      <span className="text-muted-foreground/40 w-8 shrink-0 text-right pr-2 select-none">
        {lineNumber}
      </span>

      {/* Indented Content Wrapper */}
      <div
        className="flex items-center gap-0 py-0.5"
        style={{ paddingLeft: `${expr.depth * 16 + 8}px` }}
      >
        {/* Prefix with helper name highlighted */}
        <span className={cn("text-muted-foreground shrink-0", isBlockTag && "text-amber-600")}>
          {parts.prefix}
        </span>

        {/* Argument as editable input - thin and borderless, width fits content */}
        <Input
          defaultValue={parts.argument.trim()}
          className={cn(
            "h-5 px-1 py-0 border-0 shadow-none rounded-none",
            "bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
            "text-[11px] font-mono shrink-0",
            "hover:bg-muted/50 transition-colors"
          )}
          style={{ width: `${Math.max(parts.argument.trim().length, 1) + 2}ch` }}
          title={helperConfig?.description}
          onChange={handleChange}
        />

        {/* Suffix */}
        <span className={cn("text-muted-foreground shrink-0", isBlockTag && "text-amber-600")}>
          {parts.suffix}
        </span>
      </div>
    </div>
  );
}

/**
 * Expression Tree Component
 *
 * Displays all handlebars expressions from template HTML with proper
 * indentation for block helpers. Uses thin, borderless inputs for
 * a compact, subtle appearance.
 */
export function ExpressionTree() {

  const htmlString = useDataStore((state) => state.selectedTemplateHtml);
  const setHtmlString = useDataStore((state) => state.setSelectedTemplateHtml);


  const expressions = useMemo(() => {
    if (!htmlString) return [];
    return parseHandlebarsExpressionsFlat(htmlString);
  }, [htmlString]);

  const handleUpdateExpression = (oldRaw: string, newRaw: string, position: number) => {
    if (!htmlString) return;
    const partBefore = htmlString.slice(0, position);
    const partAfter = htmlString.slice(position + oldRaw.length);
    const updatedHtml = partBefore + newRaw + partAfter;
    setHtmlString(updatedHtml);
  };

  if (!htmlString) {
    return (
      <div className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-md text-center">
        Upload a template to see expressions
      </div>
    );
  }

  if (expressions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-md text-center">
        No expressions found in template
      </div>
    );
  }

  return (
    <div className="flex flex-col py-1 overflow-auto bg-card/10 rounded-lg border">
      {expressions.map((expr, index) => (
        <ExpressionRow
          key={`${expr.position}-${index}`}
          expr={expr}
          lineNumber={index + 1}
          onUpdate={handleUpdateExpression}
        />
      ))}
    </div>
  );
}
