import {Pipe, PipeTransform} from '@angular/core';
import {KeyValue} from "@angular/common";

@Pipe({
  name: 'keyvalue'
})
export declare class KeyvalueePipe implements PipeTransform {

  transform<K, V>(input: ReadonlyMap<K, V>, compareFn?: (a: KeyValue<K, V>, b: KeyValue<K, V>) => number): Array<KeyValue<K, V>>;
  transform<K extends number, V>(input: Record<K, V>, compareFn?: (a: KeyValue<string, V>, b: KeyValue<string, V>) => number): Array<KeyValue<string, V>>;
  transform<K extends string, V>(input: Record<K, V> | ReadonlyMap<K, V>, compareFn?: (a: KeyValue<K, V>, b: KeyValue<K, V>) => number): Array<KeyValue<K, V>>;
  transform(input: null | undefined, compareFn?: (a: KeyValue<unknown, unknown>, b: KeyValue<unknown, unknown>) => number): null;
  transform<K, V>(input: ReadonlyMap<K, V> | null | undefined, compareFn?: (a: KeyValue<K, V>, b: KeyValue<K, V>) => number): Array<KeyValue<K, V>> | null;
  transform<K extends number, V>(input: Record<K, V> | null | undefined, compareFn?: (a: KeyValue<string, V>, b: KeyValue<string, V>) => number): Array<KeyValue<string, V>> | null;
  transform<K extends string, V>(input: Record<K, V> | ReadonlyMap<K, V> | null | undefined, compareFn?: (a: KeyValue<K, V>, b: KeyValue<K, V>) => number): Array<KeyValue<K, V>> | null;

}
