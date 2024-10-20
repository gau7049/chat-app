export function formatLastSeen(lastSeen) {
    if(!lastSeen) return ;
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);

    // Check if the last seen is within the last 24 hours
    const hoursDiff = Math.abs(now - lastSeenDate) / 36e5;

    if (hoursDiff < 24) {
        // Format to "hour:minute AM/PM"
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return lastSeenDate.toLocaleString('en-US', options); // e.g., "3:45 PM"
    } else if (hoursDiff < 48) {
        // If it's within the last 48 hours, return "Yesterday"
        return "Yesterday";
    } else {
        // Format to "MM/DD/YYYY" or any format you prefer
        return lastSeenDate.toLocaleDateString(); // e.g., "10/20/2024"
    }
}