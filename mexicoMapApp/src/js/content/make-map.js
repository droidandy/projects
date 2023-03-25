/**
 * Created by developercomputer on 07.01.16.
 */
import { List, Map } from "immutable";
import shuffle from "./../utils/array-shufle.js";

const content = [
  Map({ text: "Aguascalientes",           code: "AG", done_put_names: false, id: 1 , done_make_map: false }),
  Map({ text: "Baja California Norte",    code: "BN", done_put_names: false, id: 2 , done_make_map: false }),
  Map({ text: "Baja California Sur",      code: "BS", done_put_names: false, id: 3 , done_make_map: false }),
  Map({ text: "Campeche",                 code: "CM", done_put_names: false, id: 4 , done_make_map: false }),
  Map({ text: "Chiapas",                  code: "CP", done_put_names: false, id: 5 , done_make_map: false }),
  Map({ text: "Chihuahua",                code: "CH", done_put_names: false, id: 6 , done_make_map: false }),
  Map({ text: "Coahuila",                 code: "CA", done_put_names: false, id: 7 , done_make_map: false }),
  Map({ text: "Colima",                   code: "CL", done_put_names: false, id: 8 , done_make_map: false }),
  Map({ text: "Ciudad de México",         code: "DF", done_put_names: false, id: 9 , done_make_map: false }),
  Map({ text: "Durango",                  code: "DU", done_put_names: false, id: 10, done_make_map: false }),
  Map({ text: "Guanajuato",               code: "GT", done_put_names: false, id: 11, done_make_map: false }),
  Map({ text: "Guerrero",                 code: "GR", done_put_names: false, id: 12, done_make_map: false }),
  Map({ text: "Hidalgo",                  code: "HI", done_put_names: false, id: 13, done_make_map: false }),
  Map({ text: "Jalisco",                  code: "JA", done_put_names: false, id: 14, done_make_map: false }),
  Map({ text: "Michoacán",                code: "MC", done_put_names: false, id: 15, done_make_map: false }),
  Map({ text: "Edo. de México",           code: "MX", done_put_names: false, id: 16, done_make_map: false }),
  Map({ text: "Morelos",                  code: "MR", done_put_names: false, id: 17, done_make_map: false }),
  Map({ text: "Nayarit",                  code: "NA", done_put_names: false, id: 18, done_make_map: false }),
  Map({ text: "Nuevo León",               code: "NL", done_put_names: false, id: 19, done_make_map: false }),
  Map({ text: "Oaxaca",                   code: "OA", done_put_names: false, id: 20, done_make_map: false }),
  Map({ text: "Puebla",                   code: "PU", done_put_names: false, id: 21, done_make_map: false }),
  Map({ text: "Querétaro",                code: "QE", done_put_names: false, id: 22, done_make_map: false }),
  Map({ text: "Quintana Roo",             code: "QR", done_put_names: false, id: 23, done_make_map: false }),
  Map({ text: "San Luis Potosí",          code: "SL", done_put_names: false, id: 24, done_make_map: false }),
  Map({ text: "Sinaloa",                  code: "SI", done_put_names: false, id: 25, done_make_map: false }),
  Map({ text: "Sonora",                   code: "SO", done_put_names: false, id: 26, done_make_map: false }),
  Map({ text: "Tabasco",                  code: "TB", done_put_names: false, id: 27, done_make_map: false }),
  Map({ text: "Tamaulipas",               code: "TM", done_put_names: false, id: 28, done_make_map: false }),
  Map({ text: "Tlaxcala",                 code: "TL", done_put_names: false, id: 29, done_make_map: false }),
  Map({ text: "Veracruz",                 code: "VE", done_put_names: false, id: 30, done_make_map: false }),
  Map({ text: "Yucatán",                  code: "YU", done_put_names: false, id: 31, done_make_map: false }),
  Map({ text: "Zacatecas",                code: "ZA", done_put_names: false, id: 32, done_make_map: false })
];



export default function shuffledContent() {
  return List(shuffle(content));
}
