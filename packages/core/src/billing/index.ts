export module Billing {
  export function compute(storage: number) {
    const rate = storage <= 10 ? 4 : storage <= 100 ? 2 : 1;
    return rate * storage * 100; // the amount in pennies (the currency’s smallest unit) we multiply the result by 100.
  }
}
