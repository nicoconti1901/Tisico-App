import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: 'Tisico API',
      version: '0.1.0',
      description: 'Plataforma SHE - Seguridad, Calidad y Medio Ambiente',
    };
  }
}
