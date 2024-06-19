class Estudiante {
    constructor({
      carne,
      name,
      secondName,
      lastName,
      secondLastName,
      email,
      phoneNumber,
      campus,

    }) {
      this.carne = carne;
      this.name = name;
      this.secondName = secondName;
      this.lastName = lastName;
      this.secondLastName = secondLastName;
      this.email = email;
      this.phoneNumber = phoneNumber;
      this.campus = campus;
    }

    getCarne() {
        return this.carne;
      }
    
      getName() {
        return this.name;
      }
    
      getSecondName() {
        return this.secondName;
      }
    
      getLastName() {
        return this.lastName;
      }
    
      getSecondLastName() {
        return this.secondLastName;
      }
    
      getEmail() {
        return this.email;
      }
    
      getPhoneNumber() {
        return this.phoneNumber;
      }
    
      getCampus() {
        return this.campus;
      }

  }
  
  export {Estudiante};