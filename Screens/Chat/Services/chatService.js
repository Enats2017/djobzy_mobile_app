import { CHAT_API_URL } from "../../../api/ApiUrl";

const authHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
});

export const deleteConversationApi = async (userId, token) => {
    if (!userId || !token) return null;

    const response = await fetch(`${CHAT_API_URL}/conversations/${userId}/delete`,
        {
            method: "GET",
            headers: authHeaders(token),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || "Failed to delete conversation");
    }

    return data;
};

export const blockUserApi = async (userId, token, isBlocked = 'true') => {
    if (!userId || !token) return null;

    const response = await fetch(`${CHAT_API_URL}/users/${userId}/block-unblock`,
        {
            method: "PUT",
            headers: authHeaders(token),
            body: JSON.stringify({
                is_blocked: isBlocked,
                blocked_to: userId,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || "Failed to block user");
    }

    return data;
};