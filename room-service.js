
const gRooms = [];
// {
//     roomId,
//     members : []
// }
const findRoom = user =>
    gRooms.find(room => room.members.find(({ id }) => id === user.id));

const findAvailableRoom = () =>
    gRooms.find((room) => room.members.length === 1);

const createRoom = user => ({
    id: shortId(),
    members: [user]
});

const printRoomMsg = (msg, userRoom) =>
    console.log(
        `${msg} ${JSON.stringify(
            userRoom,
            null,
            2
        )}`
    );

const getRoom = user => {
    // first check if the user already exist by searching for his id in the rooms members.
    // if the user not exist we check if we there is an available room. if not we create new room
    var userRoom;
    var existRoom = findRoom(user);
    if (existRoom) {
        userRoom = existRoom;
        printRoomMsg(`${user.id} reconnect to room`, userRoom)

    } else {
        var availableRoom = findAvailableRoom();
        if (availableRoom) {
            userRoom = availableRoom;
            printRoomMsg(`${user.id} added to available room`, userRoom)
            userRoom.members.push(user);
        } else {
            userRoom = createRoom(user);
            gRooms.push(userRoom);
            printRoomMsg(`${user.id}  added to new room`, userRoom)
        }
    }
    return userRoom;
}

module.exports = getRoom;