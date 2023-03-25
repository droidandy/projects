import React from 'react';
import { Form, FormSpy } from 'react-final-form';
import { useBreakpoints, Grid, ContainerWrapper } from '@marketplace/ui-kit';
import { Tab, Tabs } from '@material-ui/core';
import { AutocompleteNew, Checkbox, SelectNew as Select } from 'components/Fields';
import { ServiceStep, VehicleType } from 'types/Service';
import { setFieldDataOptions } from 'helpers/formUtils';
import { useStyles } from './SelectCarService.styles';
import { AutoRepairShopList } from '../../components';
import { useCarBrand, useCarModel, useMapSearch, useCarYears } from '../../hooks/api';
import { getIds } from '../../helpers';
import { YMap } from './YMap';

type SelectCarServiceProps = {
  initialValues: any;
  data: any;
  navigate: any;
  onChange: any;
  onSet: any;
  header: any;
  onClear: any;
};

const autoserviceTypes = [
  { value: 5, label: 'Дилер' },
  { value: 4, label: 'Автотехцентр' },
  { value: 3, label: 'Универсальный автосервис' },
  { value: 2, label: 'Гаражный автосервис' },
  { value: 1, label: 'Гараж' },
  { value: 0, label: 'Без оценки Uremont' },
];
const ratingTypes = [
  { value: 9, label: 'Превосходно: 9+' },
  { value: 8, label: 'Очень хорошо: 8+' },
  { value: 7, label: 'Хорошо: 7+' },
  { value: 6, label: 'Достаточно хорошо: 6+' },
];

const typesOfWork = [
  {
    value: [
      6, 6686, 6697, 6698, 6687, 6688, 6689, 6690, 6685, 6699, 6700, 6701, 6702, 6703, 6704, 6705, 6706, 6707, 6696,
      6691, 6692, 6693, 6694, 6695,
    ],
    label: 'Мойка и уход',
  },
  {
    value: [
      7, 6746, 6747, 6742, 6748, 6749, 6750, 6753, 6754, 6755, 6756, 6757, 6758, 6752, 6751, 6759, 6743, 6744, 6760,
      6735, 6736, 6737, 6738, 6739, 6761, 6740, 6741, 6745, 6762,
    ],
    label: 'ТО',
  },
  {
    value: [
      8, 6768, 6836, 6837, 6839, 6771, 6809, 6811, 6812, 6813, 6810, 6772, 6838, 6835, 6834, 6833, 6832, 6831, 6823,
      6824, 6825, 6826, 6827, 6808, 6828, 6829, 6773, 6830, 6821, 6841, 6807, 6822, 6775, 6776, 6777, 6778, 6815, 6816,
      6817, 6818, 6819, 6806, 6820, 6769, 6770, 6801, 6842, 6802, 6803, 6804, 6805, 6763, 6774, 6767, 6814, 6779, 6764,
      6780, 6781, 6782, 6783, 6765, 6840, 6784, 6785, 6786, 6787, 6788, 6789, 6790, 6791, 6792, 6793, 6794, 6795, 6796,
      6797, 6798, 6799, 6800, 6766,
    ],
    label: 'Тюнинг',
  },
  {
    value: [
      15, 6960, 7035, 7182, 7134, 6844, 6848, 6845, 6849, 6850, 6851, 6846, 6852, 6853, 6854, 6855, 6878, 6856, 6847,
      6857, 6858, 6843, 6859, 6860, 6861, 6862, 6863, 6864, 6865, 6866, 6867, 6868, 6869, 6870, 6871, 6872, 6873, 6874,
      7183, 6962, 7036, 7135, 6880, 6954, 7097, 6881, 7184, 7064, 7037, 6994, 6998, 7038, 6964, 6999, 6882, 6941, 6965,
      6966, 7112, 7065, 6967, 7000, 7001, 6879, 7066, 6942, 6943, 6944, 6945, 6991, 7136, 6883, 7039, 7137, 7138, 7185,
      7067, 6884, 7068, 7069, 7098, 7186, 7187, 7022, 7139, 6968, 7002, 6946, 7070, 7099, 6969, 7023, 6970, 7113, 7140,
      7141, 7100, 7101, 7188, 7003, 6885, 7102, 6963, 7114, 7115, 7103, 6927, 7040, 7041, 7042, 6886, 6928, 7043, 7142,
      7143, 7044, 6887, 7071, 6888, 7045, 7046, 7072, 7004, 7047, 6889, 6890, 7048, 6936, 7144, 6891, 6937, 7005, 7104,
      6947, 7006, 6892, 6893, 6938, 7007, 7049, 6996, 7133, 7073, 6995, 7024, 6929, 7025, 6971, 6955, 6972, 7008, 6948,
      6958, 6894, 7026, 6961, 6939, 7116, 7117, 7118, 7119, 7120, 7121, 7050, 6940, 7051, 7052, 7053, 7122, 7123, 6973,
      7054, 6949, 7189, 7190, 7191, 7055, 7056, 7057, 6974, 6976, 6975, 6930, 6956, 7074, 7075, 7076, 7077, 7078, 7079,
      7080, 7081, 7082, 6950, 7083, 6895, 7105, 7192, 6896, 6897, 6898, 6899, 6900, 6901, 6977, 7058, 6993, 7193, 7106,
      6877, 7027, 7107, 6902, 6903, 6904, 6875, 6876, 7145, 7146, 7147, 7148, 6978, 7028, 7149, 7150, 7151, 7152, 7153,
      7154, 7155, 7156, 7157, 7158, 7159, 7160, 7161, 7162, 7163, 7164, 7165, 7194, 7166, 7167, 7124, 7084, 6905, 6931,
      6957, 7085, 6906, 7086, 7087, 7088, 6979, 6907, 7125, 7089, 7090, 7108, 7091, 7109, 6981, 7168, 6909, 6951, 6910,
      6984, 6935, 7009, 6908, 6952, 7126, 6985, 6986, 7127, 7010, 7011, 6911, 7169, 6912, 6913, 6987, 7092, 7170, 6914,
      7171, 6915, 7128, 6997, 7012, 7029, 7030, 7031, 7013, 7172, 7173, 7174, 7014, 6982, 7032, 7175, 7059, 7060, 7176,
      6932, 7033, 6933, 6988, 6916, 6989, 7015, 6983, 6980, 7129, 7130, 7131, 7093, 6934, 7195, 6953, 7111, 7094, 6917,
      6918, 7095, 7096, 7196, 6919, 7110, 6920, 6921, 6922, 7061, 6992, 7132, 6990, 7177, 7016, 7017, 7178, 6923, 6959,
      7179, 7062, 7063, 7180, 7018, 7019, 7197, 6924, 7020, 7021, 7181, 6925, 6926,
    ],
    label: 'Ремонт авто',
  },
  {
    value: [
      16, 6708, 6709, 6710, 6711, 6712, 6713, 6714, 6715, 6716, 6717, 6718, 6719, 6720, 6721, 6722, 6723, 6724, 7198,
      6725, 6726, 6727, 6728, 6729, 6730, 6731, 6732, 6733, 6734,
    ],
    label: 'Шиномонтаж',
  },
  { value: [7199, 7204, 7201, 7203, 7206, 7202, 7205], label: 'Прочие работы' },
];

const dataMapper = (o: { name: string; id: number }) => ({
  label: o.name,
  value: o.id,
});

const dataMapperYears = (o: string) => ({
  label: String(o),
  value: o,
});

export const SelectCarService = ({
  initialValues,
  data,
  navigate,
  onChange,
  onSet,
  header,
  onClear,
}: SelectCarServiceProps) => {
  const [tab, setTab] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const params = {
    sw_lat: data.swLat,
    ne_lat: data.neLat,
    sw_long: data.swLong,
    ne_long: data.neLong,
    with_review: data.withReview,
    with_rating: data.withRating,
    has_promotion: data.hasPromotion,
    work_type_ids: getIds(data.workType),
    mark_id: getIds(data.brand),
    classification: getIds(data.classification),
    rating_from: data.ratingFrom,
    rating_to: 10,
  };
  const { data: listOfServices, isLoading } = useMapSearch(params);
  const services = (listOfServices as any)?.data || [];

  const { data: listOfMarks } = useCarBrand(VehicleType.PASSENGER);
  const marks = ((listOfMarks as any)?.data?.marks || []).map(dataMapper);

  const { data: listOfModels } = useCarModel(data.brand?.value, { enabled: Boolean(data.brand) });
  const models = ((listOfModels as any)?.data?.models || []).map(dataMapper);

  const { data: listOfYears } = useCarYears(data.model?.value, { enabled: Boolean(data.model) });
  const years = ((listOfYears as any)?.data?.years || []).map(dataMapperYears);

  const disabled = !data.year || !data.model || !data.workType;

  const handleChangeCarService = (serviceId: any) => {
    onChange({ values: { ...data, serviceId } });
    navigate(ServiceStep.CAR_INFO);
  };

  const handleBoundsChange = (coords: any) => {
    onChange({ values: { ...data, ...coords } });
  };

  React.useEffect(() => {
    onClear();
  }, []);

  return (
    <>
      {header}
      <Form onSubmit={onSet} initialValues={initialValues} mutators={{ setFieldDataOptions }} subscription={{}}>
        {({ handleSubmit }) => (
          <form name="form-model" className={s.container} onSubmit={handleSubmit}>
            {isMobile ? null : (
              <Grid container direction="column" spacing={2} wrap="nowrap">
                <Grid item>
                  <Grid container spacing={6}>
                    <Grid item xs={6}>
                      <p className={s.label}>Фильтры</p>
                    </Grid>
                    <Grid item xs={6}>
                      <p onClick={onClear} className={s.clear}>
                        Очистить все
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {isMobile ? (
              <ContainerWrapper bgcolor="grey.200" pb={2} pt={2}>
                <Grid container direction="column" spacing={2} wrap="nowrap">
                  <Grid item>
                    <AutocompleteNew
                      className={s.control}
                      variant="outlined"
                      name="brand"
                      area="brand"
                      placeholder="Марка"
                      options={marks}
                      // disabled={!data.workType}
                    />
                  </Grid>
                  <Grid item>
                    <AutocompleteNew
                      className={s.control}
                      variant="outlined"
                      name="model"
                      area="model"
                      placeholder="Модель"
                      options={models}
                      disabled={!data.brand}
                    />
                  </Grid>
                  <Grid item>
                    <AutocompleteNew
                      className={s.control}
                      variant="outlined"
                      name="year"
                      area="year"
                      placeholder="Год"
                      options={years}
                      disabled={!data.model}
                    />
                  </Grid>
                  <Grid item>
                    <AutocompleteNew
                      className={s.control}
                      name="workType"
                      area="workType"
                      placeholder="Тип работ"
                      variant="outlined"
                      multiple
                      options={typesOfWork}
                    />
                  </Grid>
                  <Grid item>
                    <Select
                      className={s.control}
                      variant="outlined"
                      name="ratingFrom"
                      placeholder="Рейтинг"
                      options={ratingTypes}
                    />
                  </Grid>
                  <Grid item>
                    <AutocompleteNew
                      className={s.control}
                      multiple
                      name="classification"
                      area="classification"
                      placeholder="Тип автосервисов"
                      variant="outlined"
                      options={autoserviceTypes}
                    />
                  </Grid>
                  {/*<Grid item>*/}
                  {/*  <Select className={s.control} variant="outlined" name="county" placeholder="Округ" options={[]} />*/}
                  {/*</Grid>*/}
                  {/*<Grid item>*/}
                  {/*  <Select className={s.control} variant="outlined" name="region" placeholder="Район" options={[]} />*/}
                  {/*</Grid>*/}
                  {/*<Grid item>*/}
                  {/*  <Select className={s.control} variant="outlined" name="metro" placeholder="Метро" options={[]} />*/}
                  {/*</Grid>*/}
                </Grid>
                <Grid container direction="column" spacing={3} wrap="nowrap">
                  <Grid item>
                    <Checkbox name="withReview" color="primary" label="Только с отзывами" />
                  </Grid>
                  <Grid item>
                    <Checkbox name="withRating" color="primary" label="Только с рейтингом" />
                  </Grid>
                  <Grid item>
                    <Checkbox name="hasPromotion" color="primary" label="Акции" />
                  </Grid>
                </Grid>
              </ContainerWrapper>
            ) : (
              <>
                <Grid container direction="column" spacing={2} wrap="nowrap">
                  <Grid item>
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <AutocompleteNew
                          className={s.control}
                          variant="outlined"
                          name="brand"
                          area="brand"
                          placeholder="Марка"
                          options={marks}
                          // disabled={!data.workType}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <AutocompleteNew
                          className={s.control}
                          variant="outlined"
                          name="model"
                          area="model"
                          placeholder="Модель"
                          options={models}
                          disabled={!data.brand}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <AutocompleteNew
                          className={s.control}
                          variant="outlined"
                          name="year"
                          area="year"
                          placeholder="Год"
                          options={years}
                          disabled={!data.model}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <AutocompleteNew
                          className={s.control}
                          name="workType"
                          area="workType"
                          placeholder="Тип работ"
                          variant="outlined"
                          multiple
                          options={typesOfWork}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Select
                          className={s.control}
                          variant="outlined"
                          name="ratingFrom"
                          placeholder="Рейтинг"
                          options={ratingTypes}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <AutocompleteNew
                          className={s.control}
                          multiple
                          name="classification"
                          area="classification"
                          placeholder="Тип автосервисов"
                          variant="outlined"
                          options={autoserviceTypes}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  {/*<Grid item>*/}
                  {/*  <Grid container spacing={3}>*/}
                  {/*    <Grid item xs={4}>*/}
                  {/*      <Select className={s.control} variant="outlined" name="county" placeholder="Округ" options={[]} />*/}
                  {/*    </Grid>*/}
                  {/*    <Grid item xs={4}>*/}
                  {/*      <Select className={s.control} variant="outlined" name="region" placeholder="Район" options={[]} />*/}
                  {/*    </Grid>*/}
                  {/*    <Grid item xs={4}>*/}
                  {/*      <Select className={s.control} variant="outlined" name="metro" placeholder="Метро" options={[]} />*/}
                  {/*    </Grid>*/}
                  {/*  </Grid>*/}
                  {/*</Grid>*/}
                </Grid>
                <Grid container direction="row" spacing={3} wrap="nowrap">
                  <Grid item>
                    <Checkbox name="withReview" color="primary" label="Только с отзывами" />
                  </Grid>
                  <Grid item>
                    <Checkbox name="withRating" color="primary" label="Только с рейтингом" />
                  </Grid>
                  <Grid item>
                    <Checkbox name="hasPromotion" color="primary" label="Акции" />
                  </Grid>
                </Grid>
              </>
            )}
            <div className={s.content}>
              {isMobile ? (
                <>
                  <Tabs value={tab} onChange={handleChange}>
                    <Tab label="Список" />
                    <Tab label="На карте" />
                  </Tabs>
                  {tab === 0 && (
                    <AutoRepairShopList
                      isLoading={isLoading}
                      disabled={disabled}
                      onPress={handleChangeCarService}
                      items={services}
                    />
                  )}
                  {tab === 1 && (
                    <YMap
                      onBoundsChange={handleBoundsChange}
                      disabled={disabled}
                      onPress={handleChangeCarService}
                      address={[data.lat, data.long]}
                      points={services}
                    />
                  )}
                </>
              ) : (
                <div className={s.map}>
                  <div className={s.list}>
                    <AutoRepairShopList
                      isLoading={isLoading}
                      disabled={disabled}
                      onPress={handleChangeCarService}
                      items={services}
                    />
                  </div>
                  <YMap
                    onBoundsChange={handleBoundsChange}
                    disabled={disabled}
                    onPress={handleChangeCarService}
                    address={[data.lat, data.long]}
                    points={services}
                  />
                </div>
              )}
            </div>
            <FormSpy subscription={{ values: true }} onChange={onChange} />
          </form>
        )}
      </Form>
    </>
  );
};
