import React, { Component } from "react";

class Region extends Component {
  render() {
    return (
      <select
        aria-required="true"
        autoComplete="address-level1"
        className={
          (this.props.invalidFields.provinceCode ? "errors" : "") + " w-100"
        }
        name="checkout[billing_address][province]"
        id="checkout_billing_address_province"
        defaultValue={this.props.shippingAddress.provinceCode}
        onChange={this.props.handleUpdate}
        data-property="shippingAddress"
        data-subproperty="provinceCode"
      >
        {regionList.map(({ province, provinceCode }, i) => {
          return (
            <option value={provinceCode} key={provinceCode}>
              {province}
            </option>
          );
        })}
      </select>
    );
  }
}

export default Region;

const regionList = [
  { provinceCode: "", province: "-выберите регион-" },
  { provinceCode: "AD", province: "Адыгея (респ)" },
  { provinceCode: "AL", province: "Алтай (респ)" },
  { provinceCode: "ALT", province: "Алтайский (край)" },
  { provinceCode: "AMU", province: "Амурская (обл)" },
  { provinceCode: "ARK", province: "Архангельская (обл)" },
  { provinceCode: "AST", province: "Астраханская (обл)" },
  { provinceCode: "BA", province: "Башкортостан (респ)" },
  { provinceCode: "BEL", province: "Белгородская (обл)" },
  { provinceCode: "BRY", province: "Брянская (обл)" },
  { provinceCode: "BU", province: "Бурятия (респ)" },
  { provinceCode: "CE", province: "Чеченская (респ)" },
  { provinceCode: "CHE", province: "Челябинская (обл)" },
  { provinceCode: "CHU", province: "Чукотский (АО)" },
  { provinceCode: "CU", province: "Чувашская (респ)" },
  { provinceCode: "DA", province: "Дагестан (респ)" },
  { provinceCode: "YEV", province: "Еврeйская (Аобл)" },
  { provinceCode: "KHA", province: "Хабаровский (край)" },
  { provinceCode: "KK", province: "Хакасия (респ)" },
  { provinceCode: "KHM", province: "Ханты-Мансийский (АО)" },
  { provinceCode: "IN", province: "Ингушетия (респ)" },
  { provinceCode: "IRK", province: "Иркутская (обл)" },
  { provinceCode: "IVA", province: "Ивановская (обл)" },
  { provinceCode: "KB", province: "Кабардино-Балкарская (респ)" },
  { provinceCode: "KGD", province: "Калининградская (обл)" },
  { provinceCode: "KL", province: "Калмыкия (респ)" },
  { provinceCode: "KLU", province: "Калужская (обл)" },
  { provinceCode: "KAM", province: "Камчатский (край)" },
  { provinceCode: "KC", province: "Карачаево-Черкесская (респ)" },
  { provinceCode: "KR", province: "Карелия (респ)" },
  { provinceCode: "KEM", province: "Кемеровская (обл)" },
  { provinceCode: "KIR", province: "Кировская (обл)" },
  { provinceCode: "KO", province: "Коми (респ)" },
  { provinceCode: "KOS", province: "Костромская (обл)" },
  { provinceCode: "KDA", province: "Краснодарский (край)" },
  { provinceCode: "KYA", province: "Красноярский (край)" },
  { provinceCode: "KGN", province: "Курганская (обл)" },
  { provinceCode: "KRS", province: "Курская (обл)" },
  { provinceCode: "LEN", province: "Ленинградская (обл)" },
  { provinceCode: "LIP", province: "Липецкая (обл)" },
  { provinceCode: "MAG", province: "Магаданская (обл)" },
  { provinceCode: "ME", province: "Марий Эл (респ)" },
  { provinceCode: "MO", province: "Мордовия (респ)" },
  { provinceCode: "MOS", province: "Московская (обл)" },
  { provinceCode: "MOW", province: "Москва (г)" },
  { provinceCode: "MUR", province: "Мурманская (обл)" },
  { provinceCode: "NIZ", province: "Нижегородская (обл)" },
  { provinceCode: "NGR", province: "Новгородская (обл)" },
  { provinceCode: "NVS", province: "Новосибирская (обл)" },
  { provinceCode: "OMS", province: "Омская (обл)" },
  { provinceCode: "ORE", province: "Оренбургская (обл)" },
  { provinceCode: "ORL", province: "Орловская (обл)" },
  { provinceCode: "PNZ", province: "Пензенская (обл)" },
  { provinceCode: "PER", province: "Пермский (край)" },
  { provinceCode: "PRI", province: "Приморский (край)" },
  { provinceCode: "PSK", province: "Псковская (обл)" },
  { provinceCode: "ROS", province: "Ростовская (обл)" },
  { provinceCode: "RYA", province: "Рязанская (обл)" },
  { provinceCode: "SA", province: "Саха (респ)" },
  { provinceCode: "SAK", province: "Сахалинская (обл)" },
  { provinceCode: "SAM", province: "Самарская (обл)" },
  { provinceCode: "SPE", province: "Санкт-Петербург (г)" },
  { provinceCode: "SAR", province: "Саратовская (обл)" },
  { provinceCode: "SE", province: "Северная Осетия (респ)" },
  { provinceCode: "SMO", province: "Смоленская (обл)" },
  { provinceCode: "STA", province: "Ставропольский (край)" },
  { provinceCode: "SVE", province: "Свердловская (обл)" },
  { provinceCode: "TAM", province: "Тамбовская (обл)" },
  { provinceCode: "TA", province: "Татарстан (респ)" },
  { provinceCode: "TOM", province: "Томская (обл)" },
  { provinceCode: "TUL", province: "Тульская (обл)" },
  { provinceCode: "TVE", province: "Тверская (обл)" },
  { provinceCode: "TYU", province: "Тюменская (обл)" },
  { provinceCode: "TY", province: "Тыва (респ)" },
  { provinceCode: "UD", province: "Удмуртская (респ)" },
  { provinceCode: "ULY", province: "Ульяновская (обл)" },
  { provinceCode: "VLA", province: "Владимирская (обл)" },
  { provinceCode: "VGG", province: "Волгоградская (обл)" },
  { provinceCode: "VLG", province: "Вологодская (обл)" },
  { provinceCode: "VOR", province: "Воронежская (обл)" },
  { provinceCode: "YAN", province: "Ямaло-Нeнецкий (АО)" },
  { provinceCode: "YAR", province: "Ярослaвская (обл)" },
  { provinceCode: "ZAB", province: "Забайкальский край" },
];
