module.exports = {
    routes: [
        {
            path: "/api/unavailable-slots",
            method: "GET",
            handler: "api::unavailable-slot.unavailable-slot.getUnavailableSlots",
        },
        {
            path: "/api/unavailable-dates",
            method: "GET",
            handler: "api::unavailable-slot.unavailable-slot.getUnavailableDates",
        },
    ]
}