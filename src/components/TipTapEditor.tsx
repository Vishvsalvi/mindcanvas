import React from 'react'
import { EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapMenuBar from './TipTapMenuBar';
import Image from '@tiptap/extension-image'
import { Button } from './ui/button';
import Placeholder from '@tiptap/extension-placeholder'
import { useRecoilState } from 'recoil';
import { postState } from '@/app/store/atoms/editor';



export default function TipTapEditor() {


    const [editorState, setEditorState] = useRecoilState(postState);
    
    const editor = useEditor({
      autofocus: true,
        extensions: [StarterKit, Image.configure({
      inline: true,
    }), Placeholder.configure({placeholder: 'Start your article here...'})],
        content: editorState.editorContent,
        onUpdate: ({ editor }) => {
            setEditorState((prevState) => {
                return {
                    ...prevState,
                    editorContent: editor.getHTML()
                }
            
            })
        },
    })

  return (
   <>
   <div className='flex w-full' >
    {editor&& <TipTapMenuBar editor={editor} />}
    
    <Button>Saved</Button>
   </div>
   <div className='prose ' >
     <EditorContent className="text-lg" editor={editor} />
   </div>
   </>
  )
}
