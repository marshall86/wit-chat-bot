
export interface WitMessageResponse {
    entities: unknown[],
    intents: [{
        id: string,
        name: string,
        confidence: number
    }],
    text: string,
    traits: []
}
