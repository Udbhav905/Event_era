// Local Storage Management
class Storage {
    constructor() {
        this.eventsKey = 'eventera_events';
        this.usersKey = 'eventera_users';
        this.currentUserKey = 'eventera_current_user';
    }

    // Events Management
    getEvents() {
        const events = localStorage.getItem(this.eventsKey);
        return events ? JSON.parse(events) : [];
    }

    saveEvents(events) {
        localStorage.setItem(this.eventsKey, JSON.stringify(events));
    }

    addEvent(event) {
        const events = this.getEvents();
        event.id = this.generateId();
        event.createdAt = new Date().toISOString();
        events.push(event);
        this.saveEvents(events);
        return event;
    }

    updateEvent(id, updatedEvent) {
        const events = this.getEvents();
        const index = events.findIndex(event => event.id === id);
        if (index !== -1) {
            events[index] = { ...events[index], ...updatedEvent };
            this.saveEvents(events);
            return events[index];
        }
        return null;
    }

    deleteEvent(id) {
        const events = this.getEvents();
        const filteredEvents = events.filter(event => event.id !== id);
        this.saveEvents(filteredEvents);
        return filteredEvents;
    }

    // User Management
    getUsers() {
        const users = localStorage.getItem(this.usersKey);
        return users ? JSON.parse(users) : [];
    }

    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    addUser(user) {
        const users = this.getUsers();
        user.id = this.generateId();
        user.createdAt = new Date().toISOString();
        users.push(user);
        this.saveUsers(users);
        return user;
    }

    findUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    }

    // Current User Management
    getCurrentUser() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }

    setCurrentUser(user) {
        if (user) {
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        } else {
            localStorage.removeItem(this.currentUserKey);
        }
    }

    // Utility
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

const storage = new Storage();