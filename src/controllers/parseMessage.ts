function parseMessage(content:string){
    const subjectMatch = content.match(/Subject: (.+?)\*/);
    const subject = subjectMatch ? subjectMatch[1] : '';

    const bodyStartIndex = content.indexOf('Dear');
    const body = bodyStartIndex !== -1 ? content.slice(bodyStartIndex).trim() : '';

    return { subject, body };
}

export default parseMessage;


