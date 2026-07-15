import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AppConfig {
  apiUrl: string;
}

/**
 * Runtime configuration backed by environment defaults.
 * In production the Docker entrypoint generates config.json to override
 * the default apiUrl; in development config.json is optional and the
 * hard-coded environment value is used directly.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private _config: AppConfig = { apiUrl: environment.apiUrl };

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    try {
      const runtime = await firstValueFrom(
        this.http.get<AppConfig>('config.json')
      );
      if (runtime.apiUrl) {
        this._config = runtime;
      }
    } catch {
      /* empty: keep environment default */
    }
  }

  get apiUrl(): string {
    return this._config.apiUrl;
  }
}
