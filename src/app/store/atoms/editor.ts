import {atom} from 'recoil'

export const postState = atom({
    key: "postState",
    default: {
        title: '',
        editorContent: '',
        coverImg: '',
        preview: '',
        
    }
})

export const updateState = atom({
    key: "updateState",
    default: {
        title: '',
        editorContent: '',
        coverImg: '',
        tags: [],
        preview: ''
    }
})