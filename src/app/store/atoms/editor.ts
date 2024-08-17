import {atom} from 'recoil'

export const postState = atom({
    key: "postState",
    default: {
        title: '',
        editorContent: '',
        coverImg: '',
        
    }
})

export const updateState = atom({
    key: "updateState",
    default: {
        title: '',
        editorContent: '',
        coverImg: '',
        tags: []
    }
})

export const userIdState = atom({
    key: "userIdState",
    default: null
})