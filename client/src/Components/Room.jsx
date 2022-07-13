import { useParams, useSearchParams } from "react-router-dom";


const Room = () => {

    let { roomName } = useParams();
    let [searchParams] = useSearchParams();
    let username = searchParams.get("username");

    return (
        <div>
            {`Hello ${username} to ${roomName}`}
        </div>
    )
}

export default Room;