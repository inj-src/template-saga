"use client";

import Link from "next/link";
import { ChevronLeft, Book, Code, Calculator, Table as TableIcon, Terminal, Type, Equal, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import hljs from "highlight.js";
// import "highlight.js/styles/github-dark.css";
import "highlight.js/styles/stackoverflow-light.css";

const CodeBlock = ({ code, language = "handlebars" }: { code: string; language?: string }) => {
   useEffect(() => {
      hljs.highlightAll();
   }, [code]);

   return (
      <div className="relative group overflow-hidden rounded-lg border border-border/50 bg-muted/30">
         <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/50">
            <span className="text-xs font-medium text-muted-foreground uppercase">{language}</span>
         </div>
         <pre className="overflow-x-auto">
            <code className={`language-${language} text-sm`}>{code.trim()}</code>
         </pre>
      </div>
   );
};

const Section = ({ title, icon: Icon, children }: { title: string; icon: React.FC<Record<string, string>>; children: React.ReactNode }) => (
   <section className="space-y-6">
      <div className="flex items-center gap-3">
         <div className="p-2 rounded-md bg-primary/10 text-primary">
            <Icon className="w-5 h-5" />
         </div>
         <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      <div className="grid gap-8">
         {children}
      </div>
   </section>
);

const HelperDoc = ({
   name,
   description,
   usage,
   parameters,
   exampleData,
   example,
   exampleOutput
}: {
   name: string;
   description: string;
   usage: string;
   parameters?: { name: string; type: string; desc: string }[];
   exampleData?: string;
   example?: string;
   exampleOutput?: string;
}) => (
   <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
         <div>
            <h3 className="text-xl font-semibold text-primary font-mono">{`{{${name}}}`}</h3>
            <p className="text-muted-foreground mt-1">{description}</p>
         </div>
      </div>

      <div className="space-y-4">
         <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
               <Code className="w-4 h-4" /> Usage
            </h4>
            <CodeBlock code={usage} />
         </div>

         {parameters && parameters.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border/50">
               <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                     <tr>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Parameter/Option</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Type</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Description</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                     {parameters.map((param) => (
                        <tr key={param.name}>
                           <td className="px-4 py-2 font-mono text-primary font-medium">{param.name}</td>
                           <td className="px-4 py-2 text-muted-foreground italic">{param.type}</td>
                           <td className="px-4 py-2 text-muted-foreground font-light">{param.desc}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {exampleData && (
            <div className="grid md:grid-cols-2 gap-4">
               <div>
                  <h4 className="text-sm font-medium mb-2">Example Data</h4>
                  <CodeBlock code={exampleData} language="json" />
               </div>
               {example && (
                  <div>
                     <h4 className="text-sm font-medium mb-2">Example Template</h4>
                     <CodeBlock code={example} />
                  </div>
               )}
               {exampleOutput && (
                  <div className={example ? "col-span-full" : ""}>
                     <h4 className="text-sm font-medium mb-2">Resulting HTML Output</h4>
                     <CodeBlock code={exampleOutput} language="html" />
                  </div>
               )}
            </div>
         )}
      </div>
   </div>
);

export default function DocsPage() {
   return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
         {/* Navigation Header */}
         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4 md:px-8">
               <div className="flex gap-4 items-center">
                  <Link href="/">
                     <Button variant="ghost" size="sm" className="gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Editor
                     </Button>
                  </Link>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2">
                     <Book className="h-5 w-5 text-primary" />
                     <span className="font-bold text-lg hidden sm:inline-block">Handlebars Documentation</span>
                  </div>
               </div>
               <div className="flex-1" />
               <nav className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                     <a href="https://handlebarsjs.com/guide/" target="_blank" rel="noreferrer">
                        Official Guide
                     </a>
                  </Button>
               </nav>
            </div>
         </header>

         <main className="container px-4 py-10 md:px-8 max-w-5xl mx-auto">
            <div className="mb-12 space-y-4">
               <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Template Helpers
               </h1>
               <p className="text-xl text-muted-foreground">
                  A comprehensive guide to the custom and built-in Handlebars helpers available in this project.
               </p>
            </div>

            <Tabs defaultValue="custom" className="space-y-12">
               <TabsList className="bg-muted/50 p-1 h-12 shadow-sm border">
                  <TabsTrigger value="custom" className="px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                     Custom Helpers
                  </TabsTrigger>
                  <TabsTrigger value="utility" className="px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                     Utility Helpers
                  </TabsTrigger>
                  <TabsTrigger value="builtin" className="px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                     Built-in Helpers
                  </TabsTrigger>
               </TabsList>

               <TabsContent value="custom" className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Section title="Data Logic & Calculations" icon={Calculator}>
                     <HelperDoc
                        name="accumulate"
                        description="Accumulates or updates a numeric value across loop iterations. Useful for running totals or sharing state between different parts of a template."
                        usage={`{{accumulate value initial=0 key="my_total"}}`}
                        parameters={[
                           { name: "value", type: "number | string", desc: "The value to add to the accumulator. If it's a string, it will be parsed as a number." },
                           { name: "initial", type: "number", desc: "The initial value if the accumulator hasn't been initialized yet. Default: 0" },
                           { name: "key", type: "string", desc: "A unique key for the accumulator. If not provided, it uses 'value' as the key or '_accumulate_' if value is numeric." }
                        ]}
                        exampleData={`{
  "items": [
    { "price": 10 },
    { "price": 20 },
    { "price": 15 }
  ]
}`}
                        example={`{{#each items}}
  Price: {{price}} | Running Total: {{accumulate price key="subtotal"}}
{{/each}}`}
                     />
                  </Section>

                  <Section title="Tables & Advanced Iteration" icon={TableIcon}>
                     <HelperDoc
                        name="table"
                        description="A powerful block helper that intelligently maps array data to an HTML table. It automatically detects template rows and can perform bulk operations like sums or maximums."
                        usage={`{{#table items sum="amount" max="amount"}}
  <table>
    <tr>
      <td>{{name}}</td>
      <td>{{amount}}</td>
    </tr>
  </table>
{{/table}}`}
                        parameters={[
                           { name: "context", type: "Array", desc: "The array of data to iterate over (passed as the first argument)." },
                           { name: "target", type: "string", desc: "Optionally target a specific table within the block using the name defined in {{table-target}}." },
                           { name: "sum", type: "string", desc: "Comma-separated list of numeric fields to sum. Result available as @sum-field." },
                           { name: "multiply", type: "string", desc: "Comma-separated list of numeric fields to multiply. Result available as @multiply-field." },
                           { name: "length", type: "string", desc: "Comma-separated list of fields to count. Result available as @length-field." },
                           { name: "max", type: "string", desc: "Comma-separated list of fields to find the maximum. Result available as @max-field-1, @max-field-2, etc." },
                           { name: "min", type: "string", desc: "Comma-separated list of fields to find the minimum. Result available as @min-field-1, @min-field-2, etc." }
                        ]}
                     />

                     <HelperDoc
                        name="table-target"
                        description="Identifies a specific table within a larger block to be controlled by the {{table}} helper. This is essential when your block contains multiple tables. The target field is optional and defaults to 'target' if not provided."
                        usage={`
{{#table target="summary" }}
   {{#table-target "summary"}}
   <table>
      <tr><td>Row Template 1</td></tr>
   </table>
   {{/table-target}}
   <table>
      <tr><td>Row Template 2</td></tr>
   </table>
{{/table}}
`}
                     />
                  </Section>

               </TabsContent>

               <TabsContent value="utility" className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-8">
                     <div className="flex items-center gap-2 text-blue-800">
                        <Code className="w-5 h-5" />
                        <span className="font-semibold">Powered by just-handlebars-helpers</span>
                     </div>
                     <p className="text-sm text-blue-700 mt-1">
                        These helpers are provided by the <a href="https://github.com/leapfrogtechnology/just-handlebars-helpers" className="underline" target="_blank" rel="noreferrer">just-handlebars-helpers</a> library.
                     </p>
                  </div>

                  <Section title="Conditional Helpers" icon={Equal}>
                     <HelperDoc
                        name="eq"
                        description="Strict equality comparison (===). Returns true if both values are strictly equal."
                        usage={`{{eq value1 value2}}
{{#if (eq status 'active')}}Active{{/if}}`}
                        parameters={[
                           { name: "value1", type: "any", desc: "First value to compare" },
                           { name: "value2", type: "any", desc: "Second value to compare" }
                        ]}
                     />
                     <HelperDoc
                        name="neq"
                        description="Strict inequality comparison (!==). Returns true if values are not strictly equal."
                        usage={`{{neq value1 value2}}
{{#if (neq type 'draft')}}Published{{/if}}`}
                        parameters={[
                           { name: "value1", type: "any", desc: "First value to compare" },
                           { name: "value2", type: "any", desc: "Second value to compare" }
                        ]}
                     />
                     <HelperDoc
                        name="lt / lte / gt / gte"
                        description="Numeric comparison helpers: less than, less than or equal, greater than, greater than or equal."
                        usage={`{{lt 5 10}}  → true
{{lte 5 5}}  → true
{{gt 10 5}}  → true
{{gte 5 5}}  → true`}
                     />
                     <HelperDoc
                        name="and / or / not"
                        description="Logical operators for combining conditions."
                        usage={`{{#if (and isActive isPublished)}}Show{{/if}}
{{#if (or isAdmin isModerator)}}Access granted{{/if}}
{{#if (not isHidden)}}Visible{{/if}}`}
                     />
                     <HelperDoc
                        name="ifx"
                        description="Ternary conditional operator (?:). Returns one value if true, another if false."
                        usage={`{{ifx isActive 'Active' 'Inactive'}}
{{ifx (gt score 50) 'Pass' 'Fail'}}`}
                        parameters={[
                           { name: "condition", type: "boolean", desc: "Condition to evaluate" },
                           { name: "trueValue", type: "any", desc: "Value if condition is true" },
                           { name: "falseValue", type: "any", desc: "Value if condition is false (optional)" }
                        ]}
                     />
                     <HelperDoc
                        name="empty / count"
                        description="Array utility helpers for checking emptiness and getting length."
                        usage={`{{#if (empty items)}}No items{{/if}}
Total: {{count items}} items`}
                     />
                     <HelperDoc
                        name="includes"
                        description="Check if an array contains a specific value."
                        usage={`{{#if (includes roles 'admin')}}Admin Access{{/if}}`}
                        parameters={[
                           { name: "array", type: "array", desc: "Array to search" },
                           { name: "value", type: "any", desc: "Value to find" },
                           { name: "strict", type: "boolean", desc: "Use strict comparison (default: true)" }
                        ]}
                     />
                     <HelperDoc
                        name="coalesce"
                        description="Returns the first non-falsy value from the parameters. Similar to SQL COALESCE."
                        usage={`{{coalesce nickname firstName 'Anonymous'}}`}
                     />
                  </Section>

                  <Section title="String Helpers" icon={Type}>
                     <HelperDoc
                        name="uppercase / lowercase"
                        description="Convert string to uppercase or lowercase."
                        usage={`{{uppercase 'hello'}} → HELLO
{{lowercase 'WORLD'}} → world`}
                     />
                     <HelperDoc
                        name="capitalizeFirst / capitalizeEach"
                        description="Capitalize first letter of string or first letter of each word."
                        usage={`{{capitalizeFirst 'hello world'}} → Hello world
{{capitalizeEach 'hello world'}} → Hello World`}
                     />
                     <HelperDoc
                        name="concat"
                        description="Concatenate multiple strings together."
                        usage={`{{concat firstName ' ' lastName}}
{{concat 'Hello' ' ' 'World' '!'}}`}
                     />
                     <HelperDoc
                        name="join"
                        description="Join array elements with a delimiter."
                        usage={`{{join tags ', '}}
{{join names ' & '}}`}
                        parameters={[
                           { name: "array", type: "array", desc: "Array to join" },
                           { name: "delimiter", type: "string", desc: "Separator string" }
                        ]}
                     />
                     <HelperDoc
                        name="first / last"
                        description="Get the first or last element of an array."
                        usage={`{{first items}}
{{last items}}`}
                     />
                     <HelperDoc
                        name="excerpt"
                        description="Extract a substring with ellipsis."
                        usage={`{{excerpt description 100}}`}
                        parameters={[
                           { name: "string", type: "string", desc: "Source string" },
                           { name: "length", type: "number", desc: "Max length (default: 50)" }
                        ]}
                     />
                     <HelperDoc
                        name="sanitize"
                        description="Convert string to URL-friendly dash-case (kebab-case)."
                        usage={`{{sanitize 'Hello World!'}} → hello-world`}
                     />
                     <HelperDoc
                        name="newLineToBr"
                        description="Replace newline characters with <br> tags. Use triple braces to prevent escaping."
                        usage={`{{{newLineToBr multilineText}}}`}
                     />
                  </Section>

                  <Section title="Math Helpers" icon={Hash}>
                     <HelperDoc
                        name="sum / difference"
                        description="Add or subtract two numbers."
                        usage={`{{sum 10 5}}        → 15
{{difference 10 3}} → 7`}
                     />
                     <HelperDoc
                        name="multiplication / division"
                        description="Multiply or divide two numbers."
                        usage={`{{multiplication 5 4}} → 20
{{division 20 4}}      → 5`}
                     />
                     <HelperDoc
                        name="remainder"
                        description="Get the remainder of division (modulo)."
                        usage={`{{remainder 10 3}} → 1`}
                     />
                     <HelperDoc
                        name="ceil / floor / abs"
                        description="Math rounding and absolute value functions."
                        usage={`{{ceil 4.2}}  → 5
{{floor 4.8}} → 4
{{abs -5}}    → 5`}
                     />
                  </Section>

                  <Section title="Formatters" icon={Code}>
                     <HelperDoc
                        name="formatDate"
                        description="Format a date using moment.js format strings."
                        usage={`{{formatDate 'YYYY-MM-DD' date}}
{{formatDate 'MMMM Do, YYYY' createdAt}}
{{formatDate 'LLLL' date 'es'}}`}
                        parameters={[
                           { name: "format", type: "string", desc: "Moment.js format string (e.g. MM/DD/YYYY)" },
                           { name: "date", type: "date", desc: "Date to format (default: now)" },
                           { name: "locale", type: "string", desc: "Locale code (e.g. en, es)" }
                        ]}
                     />
                     <HelperDoc
                        name="formatCurrency"
                        description="Format a number as currency."
                        usage={`{{formatCurrency 1234.50 code='USD'}}
{{formatCurrency price code='EUR' locale='de'}}`}
                        parameters={[
                           { name: "value", type: "number", desc: "Currency amount" },
                           { name: "code", type: "string", desc: "Currency code (USD, EUR, etc.)" },
                           { name: "locale", type: "string", desc: "Locale for formatting" }
                        ]}
                     />
                  </Section>
               </TabsContent>

               <TabsContent value="builtin" className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Section title="Standard Handlebars Helpers" icon={Terminal}>
                     <HelperDoc
                        name="each"
                        description="Iterates over a list. Inside the block, you can use ./ to refer to the current element."
                        usage={`{{#each items}}
  <li>{{this.name}}</li>
{{/each}}`}
                     />

                     <HelperDoc
                        name="if / else / unless"
                        description="Conditional rendering based on value truthiness."
                        usage={`{{#if isActive}}
  <p>Status is Active</p>
{{else}}
  <p>Status is Inactive</p>
{{/if}}

{{#unless isHidden}}
  <p>Visible Content</p>
{{/unless}}`}
                     />

                     <HelperDoc
                        name="with"
                        description="Changes the evaluation context for a block."
                        usage={`{{#with author}}
  <p>By {{firstName}} {{lastName}}</p>
{{/with}}`}
                     />

                     <HelperDoc
                        name="lookup"
                        description="Allows for dynamic parameter resolution using Handlebars variables."
                        usage={`{{lookup ../items @index}}`}
                     />
                  </Section>
               </TabsContent>
            </Tabs>
         </main>

         <footer className="border-t bg-muted/40 py-12">
            <div className="container px-4 text-center text-muted-foreground flex flex-col items-center gap-4">
               <div className="flex items-center gap-2 font-semibold">
                  <Code className="w-5 h-5" />
                  <span>Template Saga Engine</span>
               </div>
               <p className="max-w-md text-sm">
                  This documentation covers the custom implementation of Handlebars used in our document template system.
               </p>
            </div>
         </footer>
      </div>
   );
}
