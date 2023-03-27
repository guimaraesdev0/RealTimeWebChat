export interface Bot {
    [key: string]: {
        prefixes: string[];
        commands: {
            [key: string]: (msgData: MessageType) => void;
        };
    }
}

export interface MessageType {
    author: string;
    msg: string;
    timestamp: string;
    role: 'user' | 'administrator' | 'bot';
}