import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Raw from "@editorjs/raw";
import SimpleImage from "@editorjs/simple-image";
import Link from "@editorjs/link";
import Header from "@editorjs/header";

interface UploadResult {
    success: number;
    file: { url: any };
}

const uploadImageByURL = async (e: any): Promise<UploadResult> => {
    try {
        const url = await Promise.resolve(e);
        return {
            success: 1,
            file: { url }
        };
    } catch (err) {
        throw err;
    }
};

const uploadByFile = () => {
    // Define the logic for uploadByFile
};

type ToolConfig = {
    class: any;
    config?: {
        uploader?: {
            uploadByUrl?: (e: any) => Promise<UploadResult>;
            uploadByFile?: () => void;
        };
        placeholder?: string;
        levels?: Array<number>; // Provide a type argument for the Array type
        defaultLevel?: number;
    };
};

type Tools = {
    embed: typeof Embed;
    image: ToolConfig;
    list: typeof List;
    quote: typeof Quote;
    raw: typeof Raw;
    simpleImage: typeof SimpleImage;
    link: typeof Link;
    header: ToolConfig;
};

const tools: Tools = {
    embed: Embed,
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByURL,
                uploadByFile: uploadByFile
            }
        }
    },
    list: List,
    quote: Quote,
    raw: Raw,
    simpleImage: SimpleImage,
    link: Link,
    header: {
        class: Header,
        config: {
            placeholder: "Enter a header",
            levels: [2],
            defaultLevel: 2
        }
    }
};

export default tools;
