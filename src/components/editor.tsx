"use client"

import React from "react"; 

import {BlockNoteEditor, PartialBlock} from "@blocknote/core";
import {useCreateBlockNote} from "@blocknote/react";
import {BlockNoteView} from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useRecoilState } from 'recoil';
import { postState, updateState } from '@/app/store/atoms/editor';
import { uploadFiles } from "@/utils/uploadthing";

interface EditorProps {
    onChange: () => void;
    initialContent?: string;
    editable?: boolean;
    isWriteMode?: boolean;
}

const Editor: React.FC<EditorProps> = ({ onChange, initialContent, editable, isWriteMode }) => {

    const [editorState, setEditorState] = useRecoilState(postState);
    const [editorUpdateState, setEditorUpdateState] = useRecoilState(updateState);

    const editor:BlockNoteEditor = useCreateBlockNote({
        initialContent:  initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
        uploadFile: async (file: File) => {
            const [res] = await uploadFiles('imageUploader', {
                files: [file]
            });
            return res.url;
        }
        
    })


    const onChangeFunction = async () => {

        // This is for write blog mode
        if(isWriteMode) {
            const string =  JSON.stringify(editor.document);
            const blockToHtml = await editor.blocksToHTMLLossy(editor.document);
            console.log(blockToHtml);
            setEditorState((prev) => {
                return {
                    ...prev,
                    preview: blockToHtml,
                    editorContent: string
                }
            });
        }

        // This is for edit blog mode
        if(initialContent && editable === true) {
            const string =  JSON.stringify(editor.document);
            const blockToHtml = await editor.blocksToHTMLLossy(editor.document);

            setEditorUpdateState((prev) => {
                return {
                    ...prev,
                    preview: blockToHtml,
                    editorContent: string
                }
            });
        }
        // This is for read blog mode
        else if (editable === false && initialContent) {
            const blocksFromMarkdown = await editor.tryParseMarkdownToBlocks(initialContent);
            console.log(blocksFromMarkdown);
            // console.log(blocksFromMarkdown);
            // editor.replaceBlocks(editor.document, blocksFromMarkdown);
        }
            
    }

    return(
        <div className="h-full -mx-14   " >
            <BlockNoteView editor={editor} editable={editable} theme="light" onChange={onChangeFunction} />
        </div>
    )
}

export default Editor;