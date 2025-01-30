module.exports = {
    routes: [
        {
            method: "GET",
            path: "/unavailable-dates",
            handler: "unavailable-slot.getUnavailableDates",
        },
    ]
}