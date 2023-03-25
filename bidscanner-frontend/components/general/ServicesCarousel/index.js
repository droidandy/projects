// @flow
import React from 'react';
import Carousel, { type CarouselProps } from 'components/general/Carousel';
import styled from 'styled-components';
import CastingsForgings from './icons/castingsForgings.svg';
import ChemicalProducts from './icons/chemicalProducts.svg';
import ConstructionEquipment from './icons/constructionEquipment.svg';
import ConstructionMaterials from './icons/constructionMaterials.svg';
import ConstructionServices from './icons/constructionServices.svg';
import ElectromechicalProducts from './icons/electromechanicalProducts.svg';
import ElectronicProducts from './icons/electronicProducts.svg';
import EngineeringServices from './icons/engineeringServices.svg';
import FabricatedProducts from './icons/fabricatedProducts.svg';
import Fasteners from './icons/fasteners.svg';
import ItAndTelecom from './icons/itAndTelecom.svg';
import LogisticEquipment from './icons/logisticEquipment.svg';
import LogisticServices from './icons/logisticServices.svg';
import ManufactuirngEquipment from './icons/manufacturingEquipment.svg';
import ManufacturingSupplies from './icons/manufacturingSupplies.svg';
import ManufacturingServices from './icons/manufacturingServices.svg';
import MetalProducts from './icons/metalProducts.svg';
import MineralsAndOres from './icons/minerals&ores.svg';
import MiningEquipment from './icons/miningEquipment.svg';
import MiningServices from './icons/miningServices.svg';
import MotorsGenerators from './icons/motorsGenerators.svg';
import OfficeEquipment from './icons/officeEquipment.svg';
import OilfieldEquipment from './icons/oilfieldEquipment.svg';
import OilfieldServices from './icons/oilfieldServices.svg';
import PipesValvesFittings from './icons/pipesValvesFittings.svg';
import PressureEquipment from './icons/pressureEquipment.svg';
import PumpsCompressors from './icons/pumpsCompressors.svg';
import SiteWorks from './icons/siteWorks.svg';
import TestingEquipments from './icons/testingEquipment.svg';
import WaterDistribution from './icons/waterDistribution.svg';

const services = [
  {
    image: CastingsForgings,
    title: 'Castings Forgings',
  },
  {
    image: ConstructionEquipment,
    title: 'Construction Equipment',
  },
  {
    image: ConstructionMaterials,
    title: 'Construction Materials',
  },
  {
    image: ConstructionServices,
    title: 'Construction Services',
  },
  {
    image: ElectromechicalProducts,
    title: 'Electromech. Products',
  },
  {
    image: ElectronicProducts,
    title: 'Electronic Products',
  },
  {
    image: EngineeringServices,
    title: 'Engineering Services',
  },
  {
    image: FabricatedProducts,
    title: 'Fabricated Products',
  },
  {
    image: Fasteners,
    title: 'Fasteners',
  },
  {
    image: PressureEquipment,
    title: 'Pressure Equipment',
  },
  {
    image: ItAndTelecom,
    title: 'IT And Telecom',
  },
  {
    image: LogisticEquipment,
    title: 'Logistic Equipment',
  },
  {
    image: LogisticServices,
    title: 'Logistic Services',
  },
  {
    image: ManufactuirngEquipment,
    title: 'Manufacturing Equipment',
  },
  {
    image: ManufacturingSupplies,
    title: 'Manufacturing Supplies',
  },
  {
    image: ManufacturingServices,
    title: 'Manufacturing Services',
  },
  {
    image: TestingEquipments,
    title: 'Testing Equipment',
  },
  {
    image: MetalProducts,
    title: 'Metal Products',
  },
  {
    image: MineralsAndOres,
    title: 'Minerals & Ores',
  },
  {
    image: MiningEquipment,
    title: 'Mining Equipment',
  },
  {
    image: MiningServices,
    title: 'Mining Services',
  },
  {
    image: MotorsGenerators,
    title: 'Motors Generators',
  },
  {
    image: OfficeEquipment,
    title: 'Office Equipment',
  },
  {
    image: OilfieldEquipment,
    title: 'Oilfield Equipment',
  },
  {
    image: OilfieldServices,
    title: 'Oilfield Services',
  },
  {
    image: ChemicalProducts,
    title: 'Chemical Products',
  },
  {
    image: PipesValvesFittings,
    title: 'Pipes,Valves Fittings ',
  },
  {
    image: PumpsCompressors,
    title: 'Pumps Compressors',
  },
  {
    image: SiteWorks,
    title: 'Site Works',
  },
  {
    image: WaterDistribution,
    title: 'Water Distribution',
  },
];
const CarouselWrapper = styled.div`padding-top: 200px;`;
export type ServicesProps = CarouselProps;

export default () => (
  <CarouselWrapper>
    <Carousel items={services} slidesToShow={6} color="#FF2929" small svgIcons />
  </CarouselWrapper>
);
