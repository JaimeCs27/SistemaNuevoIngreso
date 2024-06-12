// observer.js

class NotificationCenter {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers(activity, messageType) {
        const message = this.createMessage(activity, messageType);
        this.observers.forEach(observer => observer.update(message));
    }

    createMessage(activity, messageType) {
        if (messageType === 'publicacion') {
            return `Anuncio: Los invitamos a la actividad ${activity.nombre} el día ${activity.fecha}.`;
        } else if (messageType === 'recordatorio') {
            return `Recordatorio: La actividad ${activity.nombre} es en x dias.`;
        }
        return '';
    }
}

class Student {
    constructor(name) {
        this.name = name;
        this.inbox = [];
    }

    update(message) {
        this.inbox.push(message);
        console.log(`Mensaje para ${this.name}: ${message}`);
    }
}

// Exportar las clases
export { NotificationCenter, Student };
