import Video from "./Video";

//temporary displays videos of all users in call for testing
const Videos = ({ users, me }) => {

    return (
        <div>
            <Video key={me.id} stream={me.stream} name={me.name} />
            {
                users.map((user) => {
                    return <Video key={user.id} stream={user.stream} name={user.name} />
                })
            }
        </div>
    )
};

export default Videos;