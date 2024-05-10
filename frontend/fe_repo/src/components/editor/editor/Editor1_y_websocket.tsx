import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
// import * as Y from "yjs";
// import { WebsocketProvider } from 'y-websocket';


// function generateRandomColor() {
//   const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
//   return colors[Math.floor(Math.random() * colors.length)];
// }

// function generateRandomUsername() {
//   const userNumber = Math.floor(Math.random() * 1000);
//   return `User${userNumber}`;
// }

export default function App() {
  // // Initialize the Y.Doc instance
  // const doc = new Y.Doc();

  // // Create the WebsocketProvider
  // const wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', doc);

  // Random user info
  // const username = generateRandomUsername();
  // const color = generateRandomColor();

  // Listen for connection status updates
  // wsProvider.on('status', (event: any) => {
  //   console.log(event.status); // logs "connected" or "disconnected"
  // });

  // Create the BlockNote editor instance with collaboration settings
  const editor = useCreateBlockNote({
    _tiptapOptions: {
      extensions: [
        HorizontalRule,
        CodeBlock
      ]
    },
    initialContent: [
      {
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [],
        children: [],
      },
    ],
    // collaboration: {
    //   provider: wsProvider, // Specify the WebsocketProvider as the collaboration provider
    //   fragment: doc.getXmlFragment("document-store"), // Store the BlockNote data in the Y.Doc
    //   user: {
    //     name: username, // User information
    //     color: color // User's color in the collaborative environment
    //   },
    // },
  });

  // Render the BlockNote editor
  return <BlockNoteView editor={editor} />;
};
