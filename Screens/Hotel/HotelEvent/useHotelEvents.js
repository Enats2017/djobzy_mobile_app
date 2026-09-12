import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../api/ApiUrl";

export default function useHotelEvents() {
    const makeFormDataRequest = async (endpoint, formData) => {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        });

        const rawText = await response.text();
        let json;
        try {
            json = JSON.parse(rawText);
        } catch (e) {
            // Response wasn't valid JSON at all (stray echo/HTML error page/etc.)
            throw new Error("Server returned an unexpected response. Please try again.");
        }

        const isSuccess = response.ok && (json?.status === true || json?.status === 200);
        if (!isSuccess) {
            throw new Error(json?.message || "Something went wrong. Please try again.");
        }

        return json;
    };

    const makePostRequest = async (endpoint, body) => {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        return response.json();
    };

    const makeGetRequest = async (endpoint) => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });

        const rawText = await response.text();
        let json;
        try {
            json = JSON.parse(rawText);
        } catch (e) {
            throw new Error('Server returned an unexpected response. Please try again.');
        }

        const isSuccess = response.ok && (json?.status === true || json?.status === 200);
        if (!isSuccess) {
            throw new Error(json?.message || 'Something went wrong. Please try again.');
        }
        return json;
    };

    const saveHotelRoom = async (data) => {
        const formData = new FormData();
        formData.append("booking_id", data.bookingId ? String(data.bookingId) : "");
        formData.append("room_type", data.roomType ?? "");
        formData.append("number_of_rooms", data.numberOfRooms ?? "");
        formData.append("customer_weekday_rate", data.customerWeekdayPrice ?? "");
        formData.append("customer_weekend_rate", data.customerWeekendPrice ?? "");
        formData.append("weekday_rate", data.weekdayRate ?? "");
        formData.append("weekend_rate", data.weekendRate ?? "");
        formData.append("discount_percent", data.discountPercent ?? "");
        formData.append("discount_from", data.discountFrom ?? "");
        formData.append("discount_to", data.discountTo ?? "");
        formData.append("description", data.description ?? "");
        formData.append("selected_tags", JSON.stringify(data.selectedFacilities ?? []));
        formData.append("existing_images", JSON.stringify(data.existingImages ?? []));
        formData.append("refund_rules", JSON.stringify(data.refundRules ?? []));
        (data.images ?? []).forEach((img, index) => {
            const uriParts = img.uri.split(".");
            const extension = uriParts[uriParts.length - 1]?.toLowerCase() || "jpg";
            const mimeType = extension === "png" ? "image/png" : "image/jpeg";

            formData.append("room_photos[]", {
                uri: img.uri,
                name: `room_photo_${Date.now()}_${index}.${extension}`,
                type: mimeType,
            });
        });

        return makeFormDataRequest("/save-hotel-room", formData);
    };

    const getHotelBooking = async (hotelId) => {
        return makePostRequest("/view-hotel-details", {
            id: hotelId,
        });
    };

    const deleteHotelRoom = async (hotelId) => {
        return makePostRequest("/delete-hotel-room", {
            id: hotelId,
        });
    };

    const getAllHotelBookings = async (filters = {}) => {
        const params = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/all-hotel-bookings${queryString ? `?${queryString}` : ''}`;

        return makeGetRequest(endpoint);
    };

    const getMyHotelBooking = async (hotelId) => {
        return makeGetRequest("/my-hotel-booking", {});
    };

    const getCancelBookingDetails = async (guestId) => {
        return makePostRequest("/cancel-booking-details", { id: guestId });
    };

    const cancelHotelBooking = async (guestId, amount, deductionAmount) => {
        return makePostRequest("/cancel-hotel-booking", {
            id: guestId,
            amount: amount,
            deduction_amount: deductionAmount,
        });
    };

    const customerHotelView = async (roomId, checkInDate, checkOutDate) => {
        return makePostRequest("/customer-hotel-view", {
            id: roomId,
            checkin: checkInDate,
            checkout: checkOutDate,
        });
    };

    const checkAvailability = async (roomId, dateKey) => {
        const res = await makePostRequest('/room-availability', {
            room_id: roomId,
            date: dateKey,
        });
        return res;
    };

    const getCustomerDetail = async () => {
        return makePostRequest("/pay-user-detail-form", {});
    };

    /** Rooms the logged-in owner can configure — populates the room selector. */
    const getConfigurableRooms = async () => {
        return makeGetRequest("/rooms-configure");
    };

    /**
     * Per-day inventory (quantity / booked / rates / sold-out) for one room, or
     * for every room the owner has when `room` is 0.
     */
    const getRoomConfigData = async ({ room = 0, start, end }) => {
        const queryString = new URLSearchParams({
            room: String(room ?? 0),
            start: start ?? "",
            end: end ?? "",
        }).toString();

        return makeGetRequest(`/rooms-data?${queryString}`);
    };

    const updateRoomQuantity = async ({ roomId, date, totalQuantity, price }) => {
        return makePostRequest("/rooms-update-quantity", {
            room_id: roomId,
            date,
            total_quantity: totalQuantity,
            price,
        });
    };

    const updateRoomPrice = async ({ roomId, date, price }) => {
        return makePostRequest("/rooms-update-price", {
            room_id: roomId,
            date,
            price,
        });
    };

    const updateRoomCustomerPrice = async ({ roomId, date, price, customerPrice }) => {
        return makePostRequest("/rooms-update-customer-price", {
            room_id: roomId,
            date,
            price,
            customer_price: customerPrice,
        });
    };

    const updateRoomStatus = async ({ roomId, date, isSoldOut }) => {
        return makePostRequest("/rooms-update-status", {
            room_id: roomId,
            date,
            is_sold_out: isSoldOut ? 1 : 0,
        });
    };

    const redirectHotelPayment = async (payload) => {
        return makePostRequest("/redirect-Hotel-payment", payload);
    };

    return {
        saveHotelRoom,
        getHotelBooking,
        deleteHotelRoom,
        getAllHotelBookings,
        getMyHotelBooking,
        getCancelBookingDetails,
        cancelHotelBooking,
        customerHotelView,
        checkAvailability,
        getCustomerDetail,
        redirectHotelPayment,
        getConfigurableRooms,
        getRoomConfigData,
        updateRoomQuantity,
        updateRoomPrice,
        updateRoomCustomerPrice,
        updateRoomStatus
    };
}