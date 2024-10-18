import format from 'string-format';

import { Inject, Injectable, Scope } from '@nestjs/common';

import type * as Schema from '../assets/locales/en.json';
import * as en from '../assets/locales/en.json';
import * as pl from '../assets/locales/pl.json';

import { REQUEST } from '@nestjs/core';

type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[]> = T extends []
  ? never
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}.${Join<Extract<R, string[]>>}`
        : never
      : string;

@Injectable({ scope: Scope.REQUEST, durable: true })
export class I18nService {
  constructor(
    @Inject(REQUEST) private readonly payload: { localeCode: string },
  ) {}

  public static readonly defaultLanguage = 'en';
  public static readonly supportedLanguages = ['en', 'pl'];
  private readonly locales: Record<string, typeof Schema> = { en, pl };

  translate(
    key: Join<PathsToStringProps<typeof Schema>>,
    ...args: Array<string | Record<string, unknown>>
  ): string {
    console.log('this.payload: ', this.payload);
    const locale =
      this.locales[this.payload.localeCode ?? I18nService.defaultLanguage];
    console.log('locale: ', locale);

    // To support dot notation: "ERRORS.USER_NOT_FOUND"
    const text = key.split('.').reduce((o, i) => o?.[i], locale);
    console.log('text: ', text);

    console.log('format(text, ...args): ', format(text, ...args));
    return format(text, ...args);
  }
}
