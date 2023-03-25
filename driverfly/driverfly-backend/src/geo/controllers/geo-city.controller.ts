import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StateEntity } from "../entities";
import { GeoService } from "../services/geo.service";

@ApiTags('geo')
@Controller("geo/states/:stateId/counties/:countyId/cities")
export class GeoCityController {
  constructor(private readonly geoService: GeoService) {}

  @Get("/")
  async getCitiesByStateIdAndCountyId(
    @Param("stateId") stateId: number,
    @Param("countyId") countyId: number,
  ) {
    return await this.geoService.getCitiesByStateIdAndCountyId(stateId, countyId);
  }

  @Get("/:cityId/neighborhoods")
  async getNeighborhoodsByStateIdAndCountyIdAndCityId(
    @Param("stateId") stateId: number,
    @Param("countyId") countyId: number,
    @Param("cityId") cityId: number,
  ) {
    return await this.geoService.getNeighborhoodsByStateIdAndCountyIdAndCityId(stateId, countyId, cityId);
  }
}
