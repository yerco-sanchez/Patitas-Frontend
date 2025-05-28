export interface Cliente {
  idCliente: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  ciCliente: string;
  telefono: string;
  correo: string;
  direccion: string;
  tipoCliente: "Doméstico" | "Granja";
  observaciones?: string;
  estadoCliente: "Activo" | "Inactivo";
}
