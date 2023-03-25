// @flow
import React from 'react';
import Carousel, { type CarouselProps } from 'components/general/Carousel';
import styled from 'styled-components';
import CastingsForgings from './castingsForgings.svg';
import ConstructionMaterials from './constructionMaterials.svg';
import ConstructionServices from './constructionServices.svg';
import ConstructionEquipment from './constructionEquipment.svg';
import ElectromechanicalProducts from './electromechanicalProducts.svg';
import ElectronicProducts from './electronicProducts.svg';
import EngineeringServices from './engineeringServices.svg';
import FabricatedProducts from './fabricatedProducts.svg';
import Fasteners from './fasteners.svg';
import PressureEquipment from './pressureEquipment.svg';
import LogisticEquipment from './logisticEquipment.svg';
import LogisticServices from './logisticServices.svg';
import ManufacturingEquipment from './manufacturingEquipment.svg';
import ManufacturingSupplies from './manufacturingSupplies.svg';
import ManufacturingServices from './manufacturingServices.svg';
import TestingEquipment from './testingEquipment.svg';
import MetalProducts from './metalProducts.svg';
import MineralsOres from './minerals&ores.svg';
import MiningEquipment from './miningEquipment.svg';
import MiningServices from './miningServices.svg';
import MotorsGenerators from './motorsGenerators.svg';
import OfficeEquipment from './officeEquipment.svg';
import OilfieldEquipment from './oilfieldEquipment.svg';
import ChemicalProducts from './chemicalProducts.svg';
import PipesValvesFittings from './pipesValvesFittings.svg';
import PumpsCompressors from './pumpsCompressors.svg';
import SiteWorks from './siteWorks.svg';
import WaterDistribution from './waterDistribution.svg';

const services = [
  {
    image: CastingsForgings,
    title: 'Casting Forgings',
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
    image: ElectromechanicalProducts,
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
    image: LogisticEquipment,
    title: 'Logistic Equipment',
  },
  {
    image: LogisticServices,
    title: 'Logistic Services',
  },
  {
    image: ManufacturingEquipment,
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
    image: TestingEquipment,
    title: 'Testing Equipment',
  },
  {
    image: MetalProducts,
    title: 'Metal Products',
  },
  {
    image: MineralsOres,
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
