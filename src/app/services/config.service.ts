import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  apiUrl: string;
}

/**
 * Loads runtime configuration from config.json before the app boots.
 * In production the Docker entrypoint overwrites config.json with the
 * actual API_URL; in development the default empty string keeps requests
 * relative so the Angular dev-server proxy (proxy.conf.json) still works.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private _config: AppConfig | null = null;

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    this._config = await firstValueFrom(
      this.http.get<AppConfig>('config.json')
    );
  }

  get apiUrl(): string {
    return this._config?.apiUrl ?? '';
  }
}
