import { defaultSchema } from "@atlaskit/adf-schema/schema-default";
import { JSONTransformer } from "@atlaskit/editor-json-transformer";
import { MarkdownTransformer } from "@atlaskit/editor-markdown-transformer";
import { renderToMarkdown } from "@tiptap/static-renderer";
import {
    defaultMarkdownSerializer,
    MarkdownSerializer,
} from "prosemirror-markdown";

const jsonTransformer = new JSONTransformer();

const markdownTransformer = new MarkdownTransformer(defaultSchema);

const markdownText = `**Bold Text**

*Italics Text*

<u>Underline Text</u>

~~Strike-through Text~~

Unordered List

-  Item 1
-  Item 2
-  Item 3

Ordered List

1. Item 1
2. Item 2
3. Item 3

[Link](https://demo-eu-2.leanix.net/TeamFusionDev/dashboard/2a7d9e9f-0de2-4eff-9660-06548b90c5c2)
`;

const adfContent = `
  {
    "version": 1,
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Bold Text",
            "marks": [{ "type": "strong" }]
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Italics Text",
            "marks": [{ "type": "em" }]
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Underline Text", "marks": [{ "type": "underline" }] }]
      },
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Strike-through Text",
            "marks": [{ "type": "strike" }]
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Unordered List" }]
      },
      {
        "type": "bulletList",
        "content": [
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Item 1" }]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Item 2" }]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Item 3" }]
              }
            ]
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Ordered List" }]
      },
      {
        "type": "orderedList",
        "attrs": { "order": 1 },
        "content": [
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Item 1" }]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Item 2" }]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Item 3" }]
              }
            ]
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Link",
            "marks": [
              {
                "type": "link",
                "attrs": {
                  "href": "https://demo-eu-2.leanix.net/TeamFusionDev/dashboard/2a7d9e9f-0de2-4eff-9660-06548b90c5c2"
                }
              }
            ]
          }
        ]
      }
    ]
  }

  `;

const adfDocument = jsonTransformer.encode(
    markdownTransformer.parse(markdownText) as any,
);

console.dir(adfDocument, { depth: null, colors: true });

const defaultSerializer = defaultMarkdownSerializer;
const markdownSerializer = new MarkdownSerializer(
    {
        ...defaultSerializer.nodes,
        bulletList: defaultSerializer.nodes.bullet_list,
        orderedList: defaultSerializer.nodes.ordered_list,
        listItem: defaultSerializer.nodes.list_item,
    },
    {
        ...defaultSerializer.marks,
        underline: {
            open: "<u>",
            close: "</u>",
        },
        strike: {
            open: "~~",
            close: "~~",
            expelEnclosingWhitespace: true,
        },
    },
);

const markdownDocument = markdownSerializer.serialize(
    jsonTransformer.parse(JSON.parse(adfContent)) as any,
);

const tipTapMarkdown = renderToMarkdown({
    extensions: [],
    content: jsonTransformer.parse(JSON.parse(adfContent)) as any,
    options: {
        markMapping: {
            strong({ children }) {
                return `**${children}**`;
            },
            em({ children }) {
                return `*${children}*`;
            },
            link({ children, mark, node, parent }) {
                return `[${children}](${mark.attrs.href})`;
            },
            underline({ children }) {
                return `<u>${children}</u>`;
            },
            strike({ children }) {
                return `~~${children}~~`;
            },
        },
    },
});

console.group("Prosemirror Markdown");
console.dir(markdownDocument, { depth: null, colors: true });
console.groupEnd();

console.group("TipTap Markdown");
console.dir(tipTapMarkdown, { depth: null, colors: true });
console.groupEnd();
