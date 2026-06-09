import moment from "moment";
import React from "react";

export const ChatFormatLastSeen = ({ lastSeen }) => {
    if (!lastSeen) return "";
    const d = moment(lastSeen);
    if (d.isSame(moment(), "day")) {
        return `last seen today at ${d.format("h:mm A")}`;
    }
    if (d.isSame(moment().subtract(1, "day"), "day")) {
        return `last seen yesterday at ${d.format("h:mm A")}`;
    }
    return `last seen on ${d.format("MMM D")} at ${d.format("h:mm A")}`;
};

export const ChatFormatDay = ({ dateString }) => {
    if (!dateString) return "";

    const d = moment(dateString);
    if (d.isSame(moment(), "day")) return "Today";
    if (d.isSame(moment().subtract(1, "day"), "day")) return "Yesterday";
    return d.format("MMM D, YYYY");
};

export const FormatChatTime = React.memo(({time}) => {
    const d = moment(time); 
    const now = moment();

    if (d.isSame(now, "day")) return d.format("hh:mm A");
    if (d.isSame(now.clone().subtract(1, "day"), "day")) return "Yesterday";
    return d.format("DD/MM/YY");
});