import { useRef, useEffect } from "react";
import "./Video.css";

//temporary displays video stream of connected user for testing
const Video = ({ name, stream }) => {
    let videoRef = useRef();

    useEffect(() => {
        videoRef.current.srcObject = stream;
    }, [stream])

    return (
        <div className="Video">
            {name}
            <video ref={videoRef} playsInline autoPlay muted />

        </div>
    )
}

export default Video;