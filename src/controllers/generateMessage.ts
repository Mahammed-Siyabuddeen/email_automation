import OpenAI from "openai";


async function generateMessage(message: string) {

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: process.env.OPENAI_BASE_URL
        });

        const response = await openai.chat.completions.create({
            messages: [{
                "role": "system",
                "content": "You are a helpful assistant."
            },
            { role: 'user', content: `generate replay answer email label and body for these qestion :${message}` },],
            model: process.env.OPENAI_MODEL_NAME as string,
        });

        return response['choices'][0]['message']['content'];
    } catch (error) {
        return "I dont know";
    }

}

export default generateMessage;
