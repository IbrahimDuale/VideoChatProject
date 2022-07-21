//temporary component to display and send messages
import { useState } from "react";
import { Button, TextField } from "@mui/material";

const Messages = ({ messages, sendMessage }) => {
    let [message, setMessage] = useState("");

    let text = messages.map((m, index) => {
        let msg = '';
        if (m.fromSelf)
            msg += "You ";
        else
            msg += m.username + " ";
        msg += `(${m.timeStamp}): `;
        msg += m.message;
        return <li key={index}>{msg}</li>
    })
    return (
        <div>
            <ul>
                {text}
            </ul>
            <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="message" label="Message" variant="standard" />
            <Button variant="contained" onClick={() => sendMessage(message)}>Submit</Button>
        </div>
    )
}

export default Messages;