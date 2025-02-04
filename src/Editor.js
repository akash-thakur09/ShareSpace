import { SharedString } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import Quill from "quill";

const client = new TinyliciousClient();
const containerSchema = {
  initialObjects: { sharedText: SharedString },
};

const root = document.getElementById("editor");
const createNewEditor = async () => {
  const { container } = await client.createContainer(containerSchema);
  const sharedText = container.initialObjects.sharedText;

  if (sharedText.getLength() === 0) {
    sharedText.insertText(0, "Start typing collaboratively...");
  }

  const id = await container.attach();
  renderQuillEditor(sharedText, root);
  return id;
};

const loadExistingEditor = async (id) => {
  const { container } = await client.getContainer(id, containerSchema);
  const sharedText = container.initialObjects.sharedText;
  renderQuillEditor(sharedText, root);
};

async function start() {
  if (location.hash) {
    await loadExistingEditor(location.hash.substring(1));
  } else {
    const id = await createNewEditor();
    location.hash = id;
  }
}

start().catch((error) => console.error(error));

const renderQuillEditor = (sharedText, elem) => {
  const quill = new Quill(elem, {
    theme: "snow",
    placeholder: "Start typing...",
  });

  let isUpdating = false;

  let initialText = sharedText.getText();
  quill.setText(initialText);

  quill.on("text-change", () => {
    if (isUpdating) return;
    isUpdating = true;
    const newText = quill.getText();
    sharedText.replaceText(0, sharedText.getLength(), newText);
    isUpdating = false;
  });

  sharedText.on("sequenceDelta", () => {
    if (isUpdating) return;
    isUpdating = true;
    const updatedText = sharedText.getText();
    quill.setText(updatedText);
    isUpdating = false;
  });

  window.fluidStarted = true;
};

const copyEditorLink = () => {
  const link = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
  navigator.clipboard.writeText(link).then(() => {
    alert("Editor link copied to clipboard!");
  }).catch((err) => {
    console.error("Failed to copy link: ", err);
  });
};
const copyButton = document.getElementById("copyButton");
copyButton.onclick = copyEditorLink;



// import { SharedString } from "fluid-framework";
// import { TinyliciousClient } from "@fluidframework/tinylicious-client";
// import { useMemo, useState, useCallback } from "react";
// import { createEditor, Transforms, Editor, Text } from 'slate';
// import { Slate, Editable, withReact } from 'slate-react';

// const client = new TinyliciousClient();
// const containerSchema = {
//   initialObjects: { sharedText: SharedString },
// };

// const root = document.getElementById("editor");

// const createNewEditor = async () => {
//   const { container } = await client.createContainer(containerSchema);
//   const sharedText = container.initialObjects.sharedText;

//   if (sharedText.getLength() === 0) {
//     sharedText.insertText(0, "Start typing collaboratively...");
//   }

//   const id = await container.attach();
//   renderSlateEditor(sharedText, root);
//   return id;
// };

// const loadExistingEditor = async (id) => {
//   const { container } = await client.getContainer(id, containerSchema);
//   const sharedText = container.initialObjects.sharedText;
//   renderSlateEditor(sharedText, root);
// };

// async function start() {
//   if (location.hash) {
//     await loadExistingEditor(location.hash.substring(1));
//   } else {
//     const id = await createNewEditor();
//     location.hash = id;
//   }
// }

// start().catch((error) => console.error(error));

// const renderSlateEditor = (sharedText, elem) => {
//   const EditorComponent = () => {
//     const [value, setValue] = useState([
//       {
//         type: 'paragraph',
//         children: [{ text: sharedText.getText() }],
//       },
//     ]);

//     const editor = useMemo(() => withReact(createEditor()), []);

//     // Handle editor changes
//     const onChange = useCallback((newValue) => {
//       const isUpdating = Editor.operations.some(
//         (op) => op.type === 'set_selection' || op.type === 'move_node'
//       );
      
//       if (!isUpdating) {
//         const textContent = newValue.map(n => Node.string(n)).join('\n');
//         sharedText.replaceText(0, sharedText.getLength(), textContent);
//       }
//       setValue(newValue);
//     }, []);

//     // Handle updates from Fluid shared text
//     useEffect(() => {
//       const handleFluidUpdate = () => {
//         const updatedText = sharedText.getText();
//         const nodes = [{ type: 'paragraph', children: [{ text: updatedText }] }];
//         Transforms.select(editor, { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 0 } });
//         Transforms.insertText(editor, updatedText, { at: [0, 0] });
//       };

//       sharedText.on("sequenceDelta", handleFluidUpdate);
//       return () => sharedText.off("sequenceDelta", handleFluidUpdate);
//     }, [sharedText]);

//     return (
//       <Slate editor={editor} value={value} onChange={onChange}>
//         <Editable
//           placeholder="Start typing..."
//           renderLeaf={({ attributes, children }) => (
//             <span {...attributes}>{children}</span>
//           )}
//         />
//       </Slate>
//     );
//   };

//   // Render the Slate editor
//   ReactDOM.render(<EditorComponent />, elem);
// };

// const copyEditorLink = () => {
//   const link = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
//   navigator.clipboard.writeText(link).then(() => {
//     alert("Editor link copied to clipboard!");
//   }).catch((err) => {
//     console.error("Failed to copy link: ", err);
//   });
// };

// const copyButton = document.getElementById("copyButton");
// copyButton.onclick = copyEditorLink;
