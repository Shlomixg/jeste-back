const gRooms = [];
// {
//     roomId,
//     members : []
// }
const findRoom = roomId => {
	gRooms.find(room => room.id === roomId);
};


const createRoom = id => ({ id });

const printRoomMsg = (msg, userRoom) =>
	console.log(`${msg} ${JSON.stringify(userRoom, null, 2)}`);

const getRoom = (id1, id2) => {
	var roomId = id1 > id2 ? id1 + id2 : id2 + id1;

	var userRoom;
	var existRoom = findRoom(roomId);
	if (existRoom) {
		userRoom = existRoom;
		printRoomMsg(`${user.id} reconnect to room`, userRoom);
	} else {
		userRoom = createRoom(roomId);
	}
	gRooms.push(userRoom);
	return userRoom;
};

module.exports = getRoom;
