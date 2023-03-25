type Head<T extends any[]> = T extends [any, ...any[]] ? T[0] : never;
type Tail<T extends any[]> = ((...t: T) => any) extends (_: any, ...tail: infer TT) => any ? TT : [];
type HasTail<T extends any[]> = T extends [] | [any] ? false : true;
type Last<T extends any[]> = {
  0: Last<Tail<T>>;
  1: Head<T>;
}[HasTail<T> extends true ? 0 : 1];
type Length<T extends any[]> = T['length'];

type Concat<T1 extends any[], T2 extends any[]> = [...T1, ...T2];
type Prepend<E, T extends any[]> = ((head: E, ...args: T) => any) extends (...args: infer U) => any ? U : T;

type Drop<N extends number, T extends any[], I extends any[] = []> = {
  0: Drop<N, Tail<T>, Prepend<any, I>>;
  1: T;
}[Length<I> extends N ? 1 : 0];
type Cast<X, Y> = X extends Y ? X : Y;
type ArgTypes<F, Else = never> = F extends (...args: infer A) => any ? A : Else;
type MapFunc<I = any, D = any, R = any> = (i: I, d: D) => R;

type Mappers<
  F extends MapFunc[],
  G extends MapFunc[] = [],
  I = Head<ArgTypes<Head<F>>>,
  D = Last<ArgTypes<Head<F>>>,
> = {
  0: Mappers<Tail<F>, Concat<G, [MapFunc<I, D, ReturnType<Head<F>>>]>, I & ReturnType<Head<F>>> extends infer R
    ? Cast<R, any[]>
    : any;
  1: Concat<G, [MapFunc<I, D, I & ReturnType<Head<F>>>]>;
}[HasTail<F> extends true ? 0 : 1];
type LastArgSummary<F extends MapFunc[], DT = Last<ArgTypes<Head<F>>>, DA = Last<ArgTypes<Head<F>>>> = {
  0: LastArgSummary<Tail<F>, DT & DA>;
  1: DT & DA;
}[HasTail<F> extends true ? 0 : 1];
type ReturnTypeSummary<F extends MapFunc[], DT = ReturnType<Head<F>>, DA = ReturnType<Head<F>>> = {
  0: ReturnTypeSummary<Tail<F>, DT & DA>;
  1: DT & DA;
}[HasTail<F> extends true ? 0 : 1];
type MappersRes<F extends MapFunc[]> = <
  L extends Last<F> extends infer T ? Cast<T, MapFunc> : MapFunc,
  H extends Head<F> extends infer U ? Cast<U, MapFunc> : MapFunc,
  A extends ArgTypes<H>,
>(
  ...args: [Head<ArgTypes<H>>, LastArgSummary<F>, string?]
) => ReturnTypeSummary<F>;

const pipeMapper =
  <F extends any[]>(...fnArray: F & Mappers<F>): MappersRes<F> =>
  (initial, dto, name?: string) =>
    fnArray.reduce((s, i) => {
      return i(s, dto);
    }, initial);

export { pipeMapper };
