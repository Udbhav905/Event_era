// Utility Functions
class Utils {
    static formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    static formatTime(timeString) {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    static formatDateTime(dateString, timeString) {
        return `${this.formatDate(dateString)} at ${this.formatTime(timeString)}`;
    }

    static getCategoryColor(category) {
        const colors = {
            music: '#4361ee',
            sports: '#4cc9f0',
            tech: '#7209b7',
            arts: '#f72585',
            business: '#3a0ca3'
        };
        return colors[category] || '#6c757d';
    }

    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            color: white;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Set background color based on type
        const bgColors = {
            success: '#4bb543',
            error: '#dc3545',
            info: '#4361ee',
            warning: '#ffc107'
        };
        notification.style.backgroundColor = bgColors[type] || bgColors.info;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Make Utils available globally
window.Utils = Utils;