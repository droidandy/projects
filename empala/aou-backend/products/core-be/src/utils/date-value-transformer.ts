// This utility is necessary because TypeORM deserializes 'date' columns to strings which need to be converted manually to Date objects
export class DateValueTransformer {
  public to(v: any): any { // Writing to DB
    return v;
  }

  public from(v: any): any { // Reading from DB
    return new Date(v);
  }
}
