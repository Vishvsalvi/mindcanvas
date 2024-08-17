import { Editor } from '@tiptap/react'
import React from 'react'
import {Bold, Code, Heading1, Heading2, Heading3, Image, Italic, List, ListOrdered, Quote, Strikethrough} from "lucide-react"


export default function TipTapMenuBar({editor}: {editor: Editor}) {
    const addImage = React.useCallback(() => {
        const url = window.prompt('URL')

        
    
        if (url) {
          editor.chain().focus().setImage({ src: url }).run()
        }
      }, [editor])
    
      if (!editor) {
        return null
      }
  return (
    <div className='flex flex-wrap gap-2 mr-3' >
        <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-gray-200' : 'bg-white'}
       >
            <Bold className='w-6 h-6' />
        </button>

        <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-gray-200' : 'bg-white'}
       >
            <Italic className='w-6 h-6' />
        </button>

        <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-gray-200' : 'bg-white'}
       >
            <Strikethrough className='w-6 h-6' />
        </button>


        <button
        onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
        // disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('heading', {level: 1}) ? 'bg-gray-200' : 'bg-white'} >
            <Heading1 className='w-6 h-6' />
        </button>


        <button
        onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
        // disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('heading', {level: 2}) ? 'bg-gray-200' : 'bg-white'} >
            <Heading2 className='w-6 h-6' />
        </button>

        <button
        onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
        // disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('heading', {level: 3}) ? 'bg-gray-200' : 'bg-white'} >
            <Heading3 className='w-6 h-6' />
        </button>

        <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-gray-200' : 'bg-white'} >
            <List className='w-6 h-6' />
        </button>

        <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-gray-200' : 'bg-white'} >
            <ListOrdered className='w-6 h-6' />
        </button>

        <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'bg-gray-200' : 'bg-white'} >
            <Code className='w-6 h-6' />
        </button>

        <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-gray-200' : 'bg-white'} >
            <Quote className='w-6 h-6' />
        </button>

        <button>
            <Image onClick={addImage} className='w-6 h-6' />
        </button>
    </div>
  )
}
