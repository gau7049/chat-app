export function formatLastSeen(date, type = "") {
    if(!date){
        return type ? "" : "Inactive";
    } 
    if(typeof date === 'object') return "No updates";
    const now = new Date();
    const dateDate = new Date(date);
    const hoursDiff = Math.abs(now - dateDate) / 36e5;
    if (hoursDiff < 24) {
        // Format to "hour:minute AM/PM"
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return dateDate.toLocaleString('en-US', options); // e.g., "3:45 PM"
    } else if (hoursDiff < 48) {
        // If it's within the last 48 hours, return "Yesterday"
        return "Yesterday";
    } else {
        // Format to "MM/DD/YYYY" or any format you prefer
        return dateDate.toLocaleDateString(); // e.g., "10/20/2024"
    }
}