import { HttpStatus, Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { exception } from '../../utils/response';

@Injectable()
export class RequestService {
  private readonly fetch = fetch;

  async get<T>(
    url: string,
    additionalHeaders: Record<string, string>,
  ): Promise<T> {
    try {
      const r = await this.fetch(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
          ...additionalHeaders,
        },
      });
      const data = await r.json();
      return data as T;
    } catch (error) {
      console.log(error.message);
      exception('Can not fetch data', HttpStatus.BAD_REQUEST);
    }
  }

  async post<T>(
    url: string,
    payload: Record<string, unknown> = {},
    additionalHeaders: Record<string, string> = {},
  ): Promise<T> {
    try {
      const r = await this.fetch(url, {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
          ...additionalHeaders,
        },
        body: JSON.stringify(payload),
        method: 'POST',
      });
      const data = await r.json();
      return data as T;
    } catch (error) {
      console.log(error.message);
      exception('Can not fetch data', HttpStatus.BAD_REQUEST);
    }
  }

  async postForm<T>(
    url: string,
    body: Record<string, string>,
    returnsJSON = true,
    customHeader: Record<string, string> = {},
  ): Promise<T> {
    try {
      return (await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...customHeader,
        },
        body: new URLSearchParams(body).toString(),
      }).then((r) => (returnsJSON ? r.json() : r.text()))) as T;
    } catch (error) {
      console.log(error.message);
      exception('Can not fetch data', HttpStatus.BAD_REQUEST);
    }
  }
}
