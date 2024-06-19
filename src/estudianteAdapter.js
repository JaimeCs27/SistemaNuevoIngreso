class EstudianteAdapter {
    constructor(estudiante) {
      this.estudiante = estudiante;
      this.password = this.estudiante.getCarne();
      this.rol = "NuevoPerfilEstudiante";
      this.active = true;
    }

    getCarne() {
      return this.estudiante.getCarne();
    }

    getUsername() {
      return this.estudiante.email();
    }
  
    getPassword() {
      return this.password;
    }
  
    getRol() {
      return this.rol;
    }

    getName() {
        return this.estudiante.getName();
    }

    getSecondName() {
        return this.estudiante.getSecondName();
    }

    getLastName() {
        return this.estudiante.getLastName();
    }

    getSecondLastName() {
        return this.estudiante.getSecondLastName();
    }

    getEmail() {
        return this.estudiante.getEmail();
    }

    getPhoneNumber() {
        return this.estudiante.getPhoneNumber();
    }

    getCampus() {
        return this.estudiante.getCampus();
    }


  }

  export {EstudianteAdapter};