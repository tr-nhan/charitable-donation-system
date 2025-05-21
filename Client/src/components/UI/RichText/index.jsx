import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

import MenuBar from "./MenuBar";

function RichText({ content, onChange, classCustom }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc ml-10"
                    }
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal ml-10"
                    }
                }
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"]
            }),
            Highlight.configure({
                HTMLAttributes: {
                    class: "bg-yellow-200"
                }
            })
        ],
        content: content,
        editorProps: {
            attributes: {
                class: classCustom
            }
        },
        onUpdate({ editor }) {
            const html = editor.getHTML();
            onChange(html);
        }
    });

    return (
        <>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </>
    );
}

export default RichText;
