import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageServices {
  private _storage: Storage | null = null;
  constructor(private storage: Storage) {
    this.init();
  }
  async init() {
    this._storage = await this.storage.create();
  }
  public async set(key: string, value: any): Promise<any> {
    if (!this._storage) {
      await this.init(); // Ensure storage is initialized
    }
    return this._storage?.set(key, value);
  }
  public async get(key: string): Promise<any> {
    if (!this._storage) {
      await this.init(); // Ensure storage is initialized
    }
    return this._storage?.get(key);
  }
  public async remove(key: string): Promise<any> {
    if (!this._storage) {
      await this.init(); // Ensure storage is initialized
    }
    return this._storage?.remove(key);
  }
}
