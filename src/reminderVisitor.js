// visitorPattern.js

class ElementA {
    accept(visitor) {
        visitor.visitElementA(this);
    }

    operationA() {
        return 'Cambiar estado a Notificada';
    }

    realizarRecordatorio(){
        return 'recordatorio'
    }
}

class ElementB {
    accept(visitor) {
        visitor.visitElementB(this);
    }

    operationB() {
        return 'ElementB operation';
    }
}

class VisitorP {
    visitElementA(element) {
        console.log('Visitor visiting ElementA');
        console.log(element.operationA());
    }
}

class VisitorR {
    visitElementA(element) {
        console.log('Visitor visiting ElementA');
        console.log(element.realizarRecordatorio());
    }
}

// Crear elementos
const elementA = new ElementA();
const elementB = new ElementB();

// Crear visitor
const visitor = new Visitor();

// Usar el visitante en los elementos
elementA.accept(visitor); // Salida: Visitor visiting ElementA
                          //         ElementA operation
elementB.accept(visitor); // Salida: Visitor visiting ElementB
                          //         ElementB operation
