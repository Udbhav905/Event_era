// Events Management
class EventsManager {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentFilters = {
            category: 'all',
            date: 'all',
            search: ''
        };
        
        // Bind methods to maintain 'this' context
        this.handleCreateEvent = this.handleCreateEvent.bind(this);
        this.filterEvents = this.filterEvents.bind(this);
        this.showEventDetails = this.showEventDetails.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        
        // Wait for DOM to be fully loaded before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.loadEvents();
        this.setupEventListeners();
        this.renderEvents();
    }

    loadEvents() {
        this.events = storage.getEvents();
        // If no events in storage, load sample data with videos
        if (this.events.length === 0) {
            this.loadSampleEvents();
        }
        this.filteredEvents = [...this.events];
    }

    loadSampleEvents() {
        const sampleEvents = [
            {
                id: '1',
                title: 'Tech Conference 2023',
                description: 'Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing.',
                date: '2023-12-15',
                time: '09:00',
                location: 'Convention Center, Downtown',
                category: 'tech',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
                video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                createdBy: 'admin',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Summer Music Festival',
                description: 'Three days of amazing music performances from top artists across various genres.',
                date: '2023-12-20',
                time: '14:00',
                location: 'Central Park',
                category: 'music',
                image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
                video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                createdBy: 'admin',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                title: 'Business Networking Event',
                description: 'Connect with industry leaders and expand your professional network.',
                date: '2023-12-10',
                time: '18:30',
                location: 'Grand Hotel Ballroom',
                category: 'business',
                image: 'https://images.unsplash.com/photo-1551830416-5ed6c0a42eb5?w=400',
                video: '', // No video for this event
                createdBy: 'admin',
                createdAt: new Date().toISOString()
            },
            {
                id: '4',
                title: 'Art Exhibition Opening',
                description: 'Exclusive preview of contemporary art from emerging artists.',
                date: '2023-12-18',
                time: '19:00',
                location: 'Modern Art Museum',
                category: 'arts',
                image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400',
                video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                createdBy: 'admin',
                createdAt: new Date().toISOString()
            }
        ];
        
        sampleEvents.forEach(event => storage.addEvent(event));
        this.events = storage.getEvents();
    }

    setupEventListeners() {
        // Wait a bit to ensure DOM is ready
        setTimeout(() => {
            // Event form submission
            const eventForm = document.getElementById('eventForm');
            if (eventForm) {
                eventForm.addEventListener('submit', this.handleCreateEvent);
            }

            // Filter events
            const categoryFilter = document.getElementById('categoryFilter');
            const dateFilter = document.getElementById('dateFilter');
            
            if (categoryFilter) {
                categoryFilter.addEventListener('change', (e) => {
                    this.currentFilters.category = e.target.value;
                    this.filterEvents();
                });
            }

            if (dateFilter) {
                dateFilter.addEventListener('change', (e) => {
                    this.currentFilters.date = e.target.value;
                    this.filterEvents();
                });
            }

            // Search events
            const searchInput = document.getElementById('eventSearch');
            if (searchInput && window.Utils) {
                searchInput.addEventListener('input', Utils.debounce((e) => {
                    this.currentFilters.search = e.target.value.toLowerCase();
                    this.filterEvents();
                }, 300));
            } else if (searchInput) {
                // Fallback if Utils is not available
                let searchTimeout;
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        this.currentFilters.search = e.target.value.toLowerCase();
                        this.filterEvents();
                    }, 300);
                });
            }

            // Modal close
            const eventModal = document.getElementById('eventModal');
            if (eventModal) {
                eventModal.addEventListener('click', (e) => {
                    if (e.target.id === 'eventModal') {
                        e.target.classList.add('hidden');
                    }
                });
            }

            // Setup video preview for event form
            this.setupVideoPreview();
        }, 100);
    }

    setupVideoPreview() {
        const videoInput = document.getElementById('eventVideo');
        if (videoInput) {
            videoInput.addEventListener('input', (e) => {
                this.previewVideo(e.target.value);
            });
        }
    }

    previewVideo(videoUrl) {
        // This would typically show a preview of the video
        // For now, we'll just validate the URL
        if (videoUrl) {
            console.log('Video URL provided:', videoUrl);
        }
    }

    handleCreateEvent(e) {
        e.preventDefault();
        
        if (!auth.isLoggedIn()) {
            if (window.Utils) {
                Utils.showNotification('Please login to create events', 'error');
            } else {
                alert('Please login to create events');
            }
            auth.showAuthModal('login');
            return;
        }

        const eventData = {
            title: document.getElementById('eventTitle').value,
            description: document.getElementById('eventDescription').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value,
            category: document.getElementById('eventCategory').value,
            image: document.getElementById('eventImage').value || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
            video: document.getElementById('eventVideo').value || '', // Add video URL
            createdBy: auth.getCurrentUser().id
        };

        const newEvent = storage.addEvent(eventData);
        this.events = storage.getEvents();
        this.filterEvents();
        
        e.target.reset();
        if (window.Utils) {
            Utils.showNotification('Event created successfully!', 'success');
        } else {
            alert('Event created successfully!');
        }
    }

    filterEvents() {
        if (!this.events) return;
        
        this.filteredEvents = this.events.filter(event => {
            // Category filter
            if (this.currentFilters.category !== 'all' && event.category !== this.currentFilters.category) {
                return false;
            }

            // Date filter
            if (this.currentFilters.date !== 'all') {
                const eventDate = new Date(event.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                switch (this.currentFilters.date) {
                    case 'today':
                        if (eventDate.getTime() !== today.getTime()) return false;
                        break;
                    case 'week':
                        const weekEnd = new Date(today);
                        weekEnd.setDate(today.getDate() + 7);
                        if (eventDate < today || eventDate > weekEnd) return false;
                        break;
                    case 'month':
                        const monthEnd = new Date(today);
                        monthEnd.setMonth(today.getMonth() + 1);
                        if (eventDate < today || eventDate > monthEnd) return false;
                        break;
                }
            }

            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const searchableText = `${event.title} ${event.description} ${event.location} ${event.category}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) return false;
            }

            return true;
        });

        this.renderEvents();
    }

    renderEvents() {
        const container = document.getElementById('eventsContainer');
        if (!container) return;
        
        if (this.filteredEvents.length === 0) {
            container.innerHTML = '<p class="text-center">No events found matching your criteria.</p>';
            return;
        }

        container.innerHTML = this.filteredEvents.map(event => this.createEventCard(event)).join('');
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-event').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = e.target.dataset.eventId;
                this.showEventDetails(eventId);
            });
        });

        // Add event listeners to delete buttons (only for event creators)
        document.querySelectorAll('.delete-event').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = e.target.dataset.eventId;
                this.deleteEvent(eventId);
            });
        });
    }

   createEventCard(event) {
    const isOwner = auth.isLoggedIn() && event.createdBy === auth.getCurrentUser().id;
    const categoryColor = window.Utils ? Utils.getCategoryColor(event.category) : '#6c757d';
    const formattedDate = window.Utils ? Utils.formatDate(event.date) : event.date;
    const formattedTime = window.Utils ? Utils.formatTime(event.time) : event.time;
    
    // Add video icon if event has video
    const videoIcon = event.video ? '<div class="video-icon">🎥</div>' : '';
    
    return `
        <div class="event-card ${event.video ? 'video-event-card' : ''}">
            <div class="event-media">
                <img src="${event.image}" 
                     alt="${event.title}" 
                     class="event-image"
                     onerror="Utils.handleImageError(this, '${event.title.replace(/'/g, "\\'")}')"
                     loading="lazy">
                ${videoIcon}
            </div>
            <div class="event-content">
                <h3 class="event-title">${event.title}</h3>
                <div class="event-meta">
                    <span>${formattedDate}</span>
                    <span>${formattedTime}</span>
                </div>
                <span class="event-category" style="background-color: ${categoryColor}20; color: ${categoryColor};">
                    ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
                <p class="event-description">${event.description.substring(0, 100)}...</p>
                <div class="event-actions">
                    <button class="btn btn-primary view-event" data-event-id="${event.id}">View Details</button>
                    ${isOwner ? `<button class="btn btn-danger delete-event" data-event-id="${event.id}">Delete</button>` : ''}
                </div>
            </div>
        </div>
    `;
}

    showEventDetails(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const modal = document.getElementById('eventModal');
        const content = document.getElementById('eventDetailContent');
        if (!modal || !content) return;
        
        const isOwner = auth.isLoggedIn() && event.createdBy === auth.getCurrentUser().id;
        const categoryColor = window.Utils ? Utils.getCategoryColor(event.category) : '#6c757d';
        const formattedDateTime = window.Utils ? 
            Utils.formatDateTime(event.date, event.time) : 
            `${event.date} at ${event.time}`;

        // Create media section - show video if available, otherwise show image
        const mediaSection = event.video ? 
    this.createVideoSection(event) : 
    `<img src="${event.image}" 
          alt="${event.title}" 
          class="event-detail-image"
          onerror="Utils.handleImageError(this, '${event.title.replace(/'/g, "\\'")}')">`;

        content.innerHTML = `
            <div class="event-detail-header">
                ${mediaSection}
                <h2>${event.title}</h2>
            </div>
            <div class="event-detail-info">
                <div class="info-item">
                    <strong>Date & Time:</strong>
                    <span>${formattedDateTime}</span>
                </div>
                <div class="info-item">
                    <strong>Location:</strong>
                    <span>${event.location}</span>
                </div>
                <div class="info-item">
                    <strong>Category:</strong>
                    <span class="event-category" style="background-color: ${categoryColor}20; color: ${categoryColor};">
                        ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                </div>
            </div>
            <div class="event-detail-description">
                <h3>Description</h3>
                <p>${event.description}</p>
            </div>
            <div class="event-detail-actions">
                <button class="btn btn-primary" id="registerForEvent">Register for Event</button>
                ${isOwner ? `<button class="btn btn-danger" id="deleteEvent" data-event-id="${event.id}">Delete Event</button>` : ''}
            </div>
        `;

        // Add event listeners
        const registerBtn = document.getElementById('registerForEvent');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                if (!auth.isLoggedIn()) {
                    if (window.Utils) {
                        Utils.showNotification('Please login to register for events', 'error');
                    } else {
                        alert('Please login to register for events');
                    }
                    auth.showAuthModal('login');
                    return;
                }
                if (window.Utils) {
                    Utils.showNotification('Successfully registered for the event!', 'success');
                } else {
                    alert('Successfully registered for the event!');
                }
            });
        }

        if (isOwner) {
            const deleteBtn = document.getElementById('deleteEvent');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    this.deleteEvent(e.target.dataset.eventId);
                    modal.classList.add('hidden');
                });
            }
        }

        modal.classList.remove('hidden');
    }

    createVideoSection(event) {
        return `
            <div class="video-container">
                <video 
                    controls 
                    class="event-video"
                    poster="${event.image}"
                    onerror="this.style.display='none'; document.getElementById('fallbackImage').style.display='block'"
                >
                    <source src="${event.video}" type="video/mp4">
                    <source src="${event.video}" type="video/webm">
                    <source src="${event.video}" type="video/ogg">
                    Your browser does not support the video tag.
                </video>
                <img 
                    id="fallbackImage" 
                    src="${event.image}" 
                    alt="${event.title}" 
                    style="display: none; width: 100%; border-radius: 10px;"
                >
                <div class="video-controls">
                    <button onclick="this.parentElement.parentElement.querySelector('video').play()">Play</button>
                    <button onclick="this.parentElement.parentElement.querySelector('video').pause()">Pause</button>
                    <button onclick="this.parentElement.parentElement.querySelector('video').volume += 0.1">Volume +</button>
                    <button onclick="this.parentElement.parentElement.querySelector('video').volume -= 0.1">Volume -</button>
                </div>
            </div>
        `;
    }

    deleteEvent(eventId) {
        if (!confirm('Are you sure you want to delete this event?')) return;
        
        this.events = storage.deleteEvent(eventId);
        this.filterEvents();
        if (window.Utils) {
            Utils.showNotification('Event deleted successfully', 'success');
        } else {
            alert('Event deleted successfully');
        }
    }
    
}


// Initialize EventsManager only after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.eventsManager = new EventsManager();
});