import moment from "moment";

// ✅ Expects messages in ASC order (oldest → newest)
// ChatRoom.js already reverses the API response before passing here
const ChatGroupMessagesByDate = (messages) => {
    if (!messages || messages.length === 0) return [];

    const groups = {}; // { "YYYY-MM-DD": [msg_oldest, ..., msg_newest] }
    const dayOrder = []; // days in ASC order

    messages.forEach((msg) => {
        const day = moment(msg.created_at).format("YYYY-MM-DD");
        if (!groups[day]) {
            groups[day] = [];
            dayOrder.push(day);
        }
        groups[day].push(msg);
    });

    const result = [];

    dayOrder.forEach((day) => {
        // ✅ Date separator FIRST, then messages of that day (oldest→newest)
        result.push({
            type: "date",
            id: `date-${day}`,
            day,
        });
        groups[day].forEach((msg) => {
            result.push({ type: "message", ...msg });
        });
    });

    // ✅ Result is already ASC — no reversals needed
    // FlashList renders: top=oldest, bottom=newest ✅
    return result;
};

export default ChatGroupMessagesByDate;
